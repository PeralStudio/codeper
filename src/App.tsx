import { useState, useEffect, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Code2, Paintbrush, Terminal } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import JSZip from "jszip";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import ConsoleOutput from "./components/ConsoleOutput";
import NavBar from "./components/NavBar";

const DEFAULT_HTML =
    '<div class="container">\n  <h1 class="neon-text">¡Bienvenido a CodePer!</h1>\n  <p>¡Mueve el ratón sobre el texto y mira la magia! ✨</p>\n</div>';
const DEFAULT_CSS =
    "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n" +
    "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  overflow: hidden;\n  background: #1a1a2e;\n  color: #fff;\n  font-family: Arial, sans-serif;\n  perspective: 1000px;\n}\n\n" +
    ".container {\n  text-align: center;\n  transform-style: preserve-3d;\n  position: relative;\n}\n\n" +
    "h1 {\n  font-size: 3rem;\n  text-shadow: 0 0 10px #ff0075, 0 0 20px #ff0075, 0 0 30px #ff0075, 0 0 40px #ff0075, 0 0 50px #ff0075, 0 0 60px #ff0075;\n" +
    "  transition: color 0.2s ease, transform 0.2s ease;\n  display: inline-block;\n  cursor: pointer;\n}\n\n" +
    ".neon-text:hover {\n  animation: neonGlow 2s infinite alternate;\n  color: #0ff;\n}\n\n" +
    ".container p {\n  color: #aaa;\n}\n\n" +
    "@keyframes neonGlow {\n" +
    "  0% {\n" +
    "    text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff;\n" +
    "    transform: translateY(-2px) scale(1.05);\n" +
    "  }\n" +
    "  100% {\n" +
    "    text-shadow: 0 0 5px #ff0075, 0 0 10px #ff0075, 0 0 15px #ff0075;\n" +
    "    transform: translateY(2px) scale(0.95);\n" +
    "  }\n" +
    "}\n";
const DEFAULT_JS =
    'const container = document.querySelector(".container");\n\n' +
    'document.addEventListener("mousemove", (event) => {\n' +
    '  const particle = document.createElement("div");\n' +
    '  particle.classList.add("particle");\n' +
    "  particle.style.left = `${event.clientX}px`;\n" +
    "  particle.style.top = `${event.clientY}px`;\n" +
    "  document.body.appendChild(particle);\n\n" +
    "  setTimeout(() => {\n" +
    "    particle.remove();\n" +
    "  }, 1000);\n" +
    "});\n\n" +
    'const styleParticle = document.createElement("style");\n' +
    "styleParticle.innerHTML = `\n" +
    ".particle {\n" +
    "  position: absolute;\n" +
    "  width: 8px;\n" +
    "  height: 8px;\n" +
    "  background: radial-gradient(circle, #ff0075, #0ff);\n" +
    "  border-radius: 50%;\n" +
    "  pointer-events: none;\n" +
    "  transform: translate(-50%, -50%);\n" +
    "  animation: particleFade 1s ease-out;\n" +
    "}\n" +
    "@keyframes particleFade {\n" +
    "  0% { transform: scale(1); opacity: 1; }\n" +
    "  100% { transform: scale(0.2); opacity: 0; }\n" +
    "}\n" +
    "`;\n" +
    "document.head.appendChild(styleParticle);\n";

const AUTO_SAVE_DELAY = 1500;

function App() {
    const [title, setTitle] = useState(() => {
        const saved = localStorage.getItem("codepen-title");
        return saved || "Untitled Project";
    });

    const [html, setHtml] = useState(() => {
        const saved = localStorage.getItem("codepen-html");
        return saved || DEFAULT_HTML;
    });

    const [css, setCss] = useState(() => {
        const saved = localStorage.getItem("codepen-css");
        return saved || DEFAULT_CSS;
    });

    const [js, setJs] = useState(() => {
        const saved = localStorage.getItem("codepen-js");
        return saved || DEFAULT_JS;
    });

    const [output, setOutput] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [loadingEditor, setLoadingEditor] = useState(true);

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        localStorage.setItem("codepen-title", newTitle);
    };

    const saveToLocalStorage = useCallback(() => {
        if (initialLoad) return;

        try {
            setIsSaving(true);
            localStorage.setItem("codepen-html", html);
            localStorage.setItem("codepen-css", css);
            localStorage.setItem("codepen-js", js);
            setHasUnsavedChanges(false);
            toast.success("Changes saved!", {
                style: {
                    background: "#1e1b4b",
                    color: "#e0e7ff",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                }
            });
            updateOutput(html, css, js);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            toast.error("Failed to save changes", {
                style: {
                    background: "#1e1b4b",
                    color: "#e0e7ff",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                }
            });
            setHasUnsavedChanges(true);
        } finally {
            setIsSaving(false);
        }
    }, [html, css, js, initialLoad]);

    const handleCodeChange = useCallback(
        (newHtml: string, newCss: string, newJs: string) => {
            if (initialLoad) {
                setInitialLoad(false);
                return;
            }

            const hasChanges =
                newHtml !== localStorage.getItem("codepen-html") ||
                newCss !== localStorage.getItem("codepen-css") ||
                newJs !== localStorage.getItem("codepen-js");

            if (hasChanges) {
                setHasUnsavedChanges(true);
            }
        },
        [initialLoad]
    );

    useEffect(() => {
        handleCodeChange(html, css, js);

        if (!initialLoad && hasUnsavedChanges) {
            const timeoutId = setTimeout(() => {
                saveToLocalStorage();
            }, AUTO_SAVE_DELAY);

            return () => clearTimeout(timeoutId);
        }
    }, [html, css, js, saveToLocalStorage, initialLoad, hasUnsavedChanges, handleCodeChange]);

    const updateOutput = useCallback(
        (htmlContent: string, cssContent: string, jsContent: string) => {
            const combinedOutput = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${cssContent}</style>
        </head>
        <body>${htmlContent}
        <script>
          const originalConsole = window.console;
          const formatValue = (value) => {
            if (typeof value === 'object') {
              return JSON.stringify(value, null, 2);
            }
            return String(value);
          };

          window.console = {
            ...originalConsole,
            log: function(...args) {
              window.parent.postMessage({ type: 'console', method: 'log', args }, '*');
              originalConsole.log(...args);
            },
            info: function(...args) {
              window.parent.postMessage({ type: 'console', method: 'info', args }, '*');
              originalConsole.info(...args);
            },
            debug: function(...args) {
              window.parent.postMessage({ type: 'console', method: 'debug', args }, '*');
              originalConsole.debug(...args);
            },
            warn: function(...args) {
              window.parent.postMessage({ type: 'console', method: 'warn', args: ['Warning:', ...args] }, '*');
              originalConsole.warn(...args);
            },
            error: function(...args) {
              window.parent.postMessage({ type: 'console', method: 'error', args: ['Error:', ...args] }, '*');
              originalConsole.error(...args);
            },
            table: function(data) {
              const formattedTable = JSON.stringify(data, null, 2);
              window.parent.postMessage({ type: 'console', method: 'table', args: ['Table:', formattedTable] }, '*');
              originalConsole.table(data);
            }
          };
          try {
            ${jsContent}
          } catch (error) {
            console.error(error.message);
          }
        </script>
        </body>
      </html>`;
            setOutput(combinedOutput);
        },
        []
    );

    const handleManualSave = () => {
        saveToLocalStorage();
    };

    const handleDownload = async () => {
        const zip = new JSZip();

        zip.file(
            "index.html",
            `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
<script src="script.js"></script>
</body>
</html>`
        );

        zip.file("styles.css", css);
        zip.file("script.js", js);

        try {
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Files downloaded successfully!", {
                style: {
                    background: "#1e1b4b",
                    color: "#e0e7ff",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                }
            });
        } catch (error) {
            toast.error("Error creating ZIP file", {
                style: {
                    background: "#1e1b4b",
                    color: "#e0e7ff",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                }
            });
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: "Check out my code!",
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("URL copied to clipboard!", {
                    style: {
                        background: "#1e1b4b",
                        color: "#e0e7ff",
                        border: "1px solid rgba(99, 102, 241, 0.2)"
                    }
                });
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const clearConsole = () => {
        setLogs([]);
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "console") {
                const { method, args } = event.data;
                let logMessage = `> ${args.join(" ")}`;

                switch (method) {
                    case "info":
                        logMessage = `> ℹ️ ${args.join(" ")}`;
                        break;
                    case "debug":
                        logMessage = `> 🔍 ${args.join(" ")}`;
                        break;
                    case "table":
                        logMessage = `> ${args.join("\n")}`;
                        break;
                }

                setLogs((prev) => [...prev, logMessage]);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (initialLoad) {
            updateOutput(html, css, js);
            setInitialLoad(false);
        }
    }, [initialLoad, html, css, js, updateOutput]);

    return (
        <div className="h-screen bg-gradient-to-br from-surface-900 via-surface-900 to-primary-950 flex flex-col">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e1b4b",
                        color: "#e0e7ff",
                        border: "1px solid rgba(99, 102, 241, 0.2)"
                    },
                    duration: 2000
                }}
            />
            <NavBar
                title={title}
                onTitleChange={handleTitleChange}
                onSave={handleManualSave}
                onDownload={handleDownload}
                onShare={handleShare}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
            />

            <main className="flex-1 flex flex-col">
                <div className="flex-1 p-2">
                    <PanelGroup direction="vertical" className="h-full">
                        <Panel defaultSize={40}>
                            <PanelGroup direction="horizontal" className="h-full">
                                <Panel defaultSize={33}>
                                    <CodeEditor
                                        title="HTML"
                                        language="html"
                                        value={html}
                                        onChange={setHtml}
                                        setLoadingEditor={setLoadingEditor}
                                        icon={<Code2 className="w-4 h-4" />}
                                    />
                                </Panel>

                                <PanelResizeHandle className="w-2 bg-surface-800 hover:bg-primary-600 transition-colors" />

                                <Panel defaultSize={33}>
                                    <CodeEditor
                                        title="CSS"
                                        language="css"
                                        value={css}
                                        onChange={setCss}
                                        setLoadingEditor={setLoadingEditor}
                                        icon={<Paintbrush className="w-4 h-4" />}
                                    />
                                </Panel>

                                <PanelResizeHandle className="w-2 bg-surface-800 hover:bg-primary-600 transition-colors" />

                                <Panel defaultSize={33}>
                                    <CodeEditor
                                        title="JavaScript"
                                        language="javascript"
                                        value={js}
                                        onChange={setJs}
                                        setLoadingEditor={setLoadingEditor}
                                        icon={<Terminal className="w-4 h-4" />}
                                    />
                                </Panel>
                            </PanelGroup>
                        </Panel>

                        <PanelResizeHandle className="h-2 bg-surface-800 hover:bg-primary-600 transition-colors" />

                        <Panel defaultSize={60}>
                            <PanelGroup direction="horizontal" className="h-full">
                                <Panel defaultSize={66.8}>
                                    {!loadingEditor && <Preview html={output} />}
                                </Panel>

                                <PanelResizeHandle className="w-2 bg-surface-800 hover:bg-primary-600 transition-colors" />

                                <Panel defaultSize={33.2}>
                                    <ConsoleOutput logs={logs} onClear={clearConsole} />
                                </Panel>
                            </PanelGroup>
                        </Panel>
                    </PanelGroup>
                </div>
            </main>
        </div>
    );
}

export default App;
