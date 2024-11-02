import { Terminal } from "lucide-react";

interface ConsoleProps {
    logs: string[];
}

export default function Console({ logs }: ConsoleProps) {
    return (
        <div className="h-full flex flex-col bg-gray-900">
            <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2 text-gray-300">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm">Console</span>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {logs.map((log, index) => (
                    <div key={index} className="text-gray-300 mb-1">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
