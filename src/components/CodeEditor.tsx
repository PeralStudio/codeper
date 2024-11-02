import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    title: string;
    language: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ReactNode;
    setLoadingEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CodeEditor({
    title,
    language,
    value,
    onChange,
    icon,
    setLoadingEditor
}: CodeEditorProps) {
    return (
        <div className="h-full flex flex-col bg-surface-950/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-surface-900/90 to-primary-950/90 border-b border-primary-500/20">
                <div className="flex items-center gap-2 text-primary-100">
                    <div className="p-1.5 rounded-md bg-primary-500/10 border border-primary-500/20">
                        {icon}
                    </div>
                    <span className="text-sm font-medium select-none">{title}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20">
                    {language}
                </span>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    value={value}
                    onMount={() => setLoadingEditor(false)}
                    onChange={(value) => onChange(value || "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        folding: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
}
