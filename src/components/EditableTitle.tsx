import React, { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

interface EditableTitleProps {
    title: string;
    onTitleChange: (newTitle: string) => void;
}

const MAX_TITLE_LENGTH = 30;
const DEFAULT_TITLE = "Untitled Project";

export default function EditableTitle({ title, onTitleChange }: EditableTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [editedTitle, setEditedTitle] = useState(title || DEFAULT_TITLE);

    useEffect(() => {
        if (isEditing && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isEditing]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (titleRef.current) {
            const newTitle = titleRef.current.textContent?.trim() || DEFAULT_TITLE;
            onTitleChange(newTitle);
            titleRef.current.textContent = newTitle;
            setEditedTitle(newTitle);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleBlur();
        } else if (e.key === "Escape") {
            if (titleRef.current) {
                const currentTitle = title || DEFAULT_TITLE;
                titleRef.current.textContent = currentTitle;
                setEditedTitle(currentTitle);
            }
            setIsEditing(false);
        }
    };

    const handleInputChange = (e: React.FormEvent<HTMLHeadingElement>) => {
        const value = e.currentTarget.textContent || "";
        if (value.length > MAX_TITLE_LENGTH) {
            e.currentTarget.textContent = value.slice(0, MAX_TITLE_LENGTH);
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(e.currentTarget, 1);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
        setEditedTitle(e.currentTarget.textContent || DEFAULT_TITLE);
    };

    useEffect(() => {
        if (!isEditing && titleRef.current) {
            const displayTitle = title || DEFAULT_TITLE;
            titleRef.current.textContent = displayTitle;
            setEditedTitle(displayTitle);
        }
    }, [isEditing, title]);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 group">
                <h1
                    onDoubleClick={handleClick}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onInput={handleInputChange}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    ref={titleRef}
                    className={`text-lg font-medium cursor-text ${
                        isEditing ? "bg-transparent" : "text-primary-100"
                    }`}
                    style={{
                        outline: "none",
                        border: "none",
                        padding: "0",
                        margin: "0",
                        color: isEditing ? "white" : "inherit",
                        minHeight: "1.5em"
                    }}
                >
                    {title || DEFAULT_TITLE}
                </h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-400 hover:text-primary-300 p-1.5 rounded-md hover:bg-primary-500/20"
                    title="Edit title"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                {isEditing && (
                    <div className="text-primary-400 text-sm">
                        {editedTitle.length}/{MAX_TITLE_LENGTH}
                    </div>
                )}
            </div>
        </div>
    );
}
