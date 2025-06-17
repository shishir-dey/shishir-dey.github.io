import React from 'react';
import { Pin, Clock } from 'lucide-react';

const NoteCard = ({ note, darkMode, formatDate, onNoteClick }) => {
    return (
        <div
            key={note.id}
            onClick={() => onNoteClick(note)}
            className={`rounded-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
                darkMode
                    ? 'bg-gray-800 border border-gray-700 hover:shadow-lg hover:border-yellow-400'
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-yellow-500'
            }`}
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h2 className="text-base md:text-lg font-semibold line-clamp-2 mb-0">
                            {note.title}
                        </h2>
                        {note.url && (
                            <a
                                href={note.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className={`inline-flex items-center text-sm md:text-xs tracking-wide font-semibold no-underline -mt-1
                                    ${
                                        darkMode
                                            ? 'text-amber-300 hover:text-amber-200'
                                            : 'text-amber-600 hover:text-amber-700'
                                    } transition-colors duration-200 font-sans`}
                            >
                                <span>View</span>
                                <span className="ml-1 text-[10px]">↗</span>
                            </a>
                        )}
                    </div>
                    {note.isPinned && (
                        <Pin className="text-blue-500 h-5 w-5 shrink-0 ml-2" />
                    )}
                </div>
                <p
                    className={`text-base md:text-sm line-clamp-3 mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                    {note.content}
                </p>
                <div
                    className={`flex items-center text-sm md:text-xs mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                >
                    <Clock className="h-4 w-4 md:h-3 md:w-3 mr-1" />
                    {formatDate(note.lastEdited)}
                </div>
                <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                        <span
                            key={tag}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm md:text-xs font-medium ${
                                darkMode
                                    ? 'bg-blue-900 text-blue-200'
                                    : 'bg-blue-100 text-blue-800'
                            }`}
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
