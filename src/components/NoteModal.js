import React from 'react';
import { Pin, X, Tag, Clock } from 'lucide-react';

const NoteModal = ({
    selectedNote,
    modalVisible,
    darkMode,
    formatDate,
    onClose,
}) => {
    if (!selectedNote) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
                modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black opacity-65" />
            <div
                className={`relative w-full max-w-2xl transform transition-all duration-200 ${
                    modalVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                }`}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className={`rounded-lg max-h-[90vh] overflow-y-auto ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl md:text-xl font-semibold mr-3 mb-0">
                                            {selectedNote.title}
                                        </h2>
                                        {selectedNote.url && (
                                            <a
                                                href={selectedNote.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center text-sm md:text-xs tracking-wide font-semibold no-underline -mt-1
                                                    ${
                                                        darkMode
                                                            ? 'text-amber-300 hover:text-amber-200'
                                                            : 'text-amber-600 hover:text-amber-700'
                                                    } transition-colors duration-200 font-sans`}
                                            >
                                                <span>View</span>
                                                <span className="ml-1 text-[10px]">
                                                    ↗
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                    {selectedNote.isPinned && (
                                        <Pin className="text-blue-500 h-5 w-5 shrink-0" />
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`${
                                    darkMode
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p
                            className={`text-base md:text-base whitespace-pre-wrap mb-6 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                            style={{
                                lineHeight: '1.6',
                                padding: '0 0.25rem',
                            }}
                        >
                            {selectedNote.content}
                        </p>
                        <div
                            className={`flex items-center text-sm md:text-xs mb-4 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                        >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(selectedNote.lastEdited)}
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                            <Tag
                                className={`h-4 w-4 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                            />
                            {selectedNote.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
            </div>
        </div>
    );
};

export default NoteModal;
