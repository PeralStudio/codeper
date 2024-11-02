import { /* Code2, */ Save, Download, Share2 } from "lucide-react";
import EditableTitle from "./EditableTitle";

interface NavBarProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
    onSave: () => void;
    onDownload: () => void;
    onShare: () => void;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
}

export default function NavBar({
    title,
    onTitleChange,
    onSave,
    onDownload,
    onShare,
    isSaving,
    hasUnsavedChanges
}: NavBarProps) {
    return (
        <nav className="bg-gradient-to-r from-surface-900/95 to-primary-950/95 backdrop-blur-sm border-b border-primary-500/20 px-4 py-3 shadow-glow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 text-primary-400" />
                    {/* <Code2 className="w-8 h-8 text-primary-400" /> */}
                    <EditableTitle title={title} onTitleChange={onTitleChange} />
                </div>
                <div className="flex items-center gap-2 select-none">
                    <button
                        onClick={onSave}
                        disabled={!hasUnsavedChanges || isSaving}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm ${
                            hasUnsavedChanges
                                ? "bg-primary-500 text-white hover:bg-primary-600 shadow-glow"
                                : "bg-primary-500/10 text-primary-300 cursor-not-allowed border border-primary-500/20"
                        } ${isSaving ? "animate-pulse" : ""}`}
                        title={hasUnsavedChanges ? "Save changes" : "No changes to save"}
                    >
                        <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-300 rounded-lg hover:bg-primary-500/20 transition-colors text-sm border border-primary-500/20"
                        title="Download"
                    >
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-300 rounded-lg hover:bg-primary-500/20 transition-colors text-sm border border-primary-500/20"
                    >
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
            </div>
        </nav>
    );
}
