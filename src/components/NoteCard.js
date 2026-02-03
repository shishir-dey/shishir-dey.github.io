import React from 'react';
import { Pin, Clock } from 'lucide-react';

const NoteCard = ({ note, formatDate, onNoteClick }) => {
    return (
        <div
            key={note.id}
            onClick={() => onNoteClick(note)}
            className="glass-card cursor-pointer"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h2 className="text-base md:text-lg font-semibold line-clamp-2 mb-0 text-primary">
                            {note.title}
                        </h2>
                        {note.url && (
                            <a
                                href={note.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="accent-link inline-flex items-center text-sm md:text-xs tracking-wide font-semibold no-underline -mt-1"
                            >
                                <span>View</span>
                                <span className="ml-1 text-[10px]">↗</span>
                            </a>
                        )}
                    </div>
                    {note.isPinned && (
                        <Pin className="accent-icon h-5 w-5 shrink-0 ml-2" />
                    )}
                </div>
                <p className="text-base md:text-sm line-clamp-3 mb-4 text-secondary">
                    {note.content}
                </p>
                <div className="flex items-center text-sm md:text-xs mb-3 text-tertiary">
                    <Clock className="h-4 w-4 md:h-3 md:w-3 mr-1" />
                    {formatDate(note.lastEdited)}
                </div>
                <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                        <span
                            key={tag}
                            className="tag-pill inline-flex items-center px-2 py-0.5 rounded-full text-sm md:text-xs font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
