import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
    language: string;
    value: string;
    onChange: (value: string) => void;
    title: string;
}

export default function Editor({ language, value, onChange, title }: EditorProps) {
    return (
        <div className="h-full flex flex-col bg-gray-900">
            <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300">{title}</span>
            </div>
            <div className="flex-1">
                <MonacoEditor
                    height="100%"
                    language={language}
                    value={value}
                    onChange={(value) => onChange(value || "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                    }}
                />
            </div>
        </div>
    );
}
