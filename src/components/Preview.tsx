import { useEffect, useRef } from "react";
import { Play } from "lucide-react";

interface PreviewProps {
    html: string;
}

export default function Preview({ html }: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const blob = new Blob([html], { type: "text/html;charset=utf-8" });
            const blobUrl = URL.createObjectURL(blob);

            iframeRef.current.src = blobUrl;

            return () => {
                URL.revokeObjectURL(blobUrl);
            };
        }
    }, [html]);

    return (
        <div className="h-full flex flex-col bg-surface-950/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-surface-900/90 to-primary-950/90 border-b border-primary-500/20">
                <div className="flex items-center gap-2 text-primary-100">
                    <div className="p-1.5 rounded-md bg-primary-500/10 border border-primary-500/20">
                        <Play className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium select-none">Preview</span>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-lg m-2 shadow-lg overflow-hidden">
                <iframe
                    ref={iframeRef}
                    title="preview"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-modals"
                />
            </div>
        </div>
    );
}
