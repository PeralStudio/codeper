import { useEffect, useRef } from "react";
import { Terminal, Trash2 } from "lucide-react";

interface ConsoleOutputProps {
    logs: string[];
    onClear: () => void;
}

const getLogStyle = (log: string) => {
    if (log.startsWith("> Error:")) {
        return "pl-2 border-l-2 border-red-400 bg-red-500/10 text-red-400";
    }
    if (log.startsWith("> Warning:")) {
        return "pl-2 border-l-2 border-amber-400 bg-amber-500/10 text-amber-400";
    }
    if (log.startsWith("> ℹ️")) {
        return "pl-2 border-l-2 border-primary-400 bg-primary-500/10 text-primary-400";
    }
    if (log.startsWith("> 🔍")) {
        return "pl-2 border-l-2 border-violet-400 bg-violet-500/10 text-violet-400";
    }
    if (log.startsWith("> Table")) {
        return "pl-2 border-l-2 border-emerald-400 bg-emerald-500/10 text-emerald-400 whitespace-pre";
    }
    return "text-surface-300";
};

export default function ConsoleOutput({ logs, onClear }: ConsoleOutputProps) {
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="h-full flex flex-col bg-surface-950/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-surface-900/90 to-primary-950/90 border-b border-primary-500/20">
                <div className="flex items-center gap-2 text-primary-100">
                    <div className="p-1.5 rounded-md bg-primary-500/10 border border-primary-500/20">
                        <Terminal className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium select-none">Console</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20 select-none">
                        {logs.length} {logs.length === 1 ? "message" : "messages"}
                    </span>
                    <button
                        onClick={onClear}
                        className="p-1.5 rounded-md text-primary-400 hover:text-primary-300 bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                        title="Clear console"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div
                ref={consoleRef}
                className="flex-1 p-4 font-mono text-sm overflow-auto bg-surface-950/50"
            >
                {logs.map((log, index) => (
                    <div key={index} className={`mb-2 rounded-md py-1.5 px-2 ${getLogStyle(log)}`}>
                        {log}
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-surface-500 italic text-sm">No console output</div>
                )}
            </div>
        </div>
    );
}
