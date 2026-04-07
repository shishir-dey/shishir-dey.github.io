import React from 'react';
import { Tag, Clock } from 'lucide-react';

const NoteModal = ({ selectedNote, modalVisible, formatDate, onClose }) => {
    if (!selectedNote) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
                modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div className="fixed inset-0 glass-backdrop" />
            <div
                className={`relative w-full max-w-2xl transform transition-all duration-200 ${
                    modalVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                }`}
                onClick={e => e.stopPropagation()}
            >
                <div className="glass-modal max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl md:text-xl font-semibold mr-3 mb-0 text-primary">
                                            {selectedNote.title}
                                        </h2>
                                        {selectedNote.url && (
                                            <a
                                                href={selectedNote.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="accent-link inline-flex items-center text-sm md:text-xs tracking-wide font-semibold no-underline -mt-1"
                                            >
                                                <span>View</span>
                                                <span className="ml-1 text-[10px]">
                                                    ↗
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="modal-close"
                                aria-label="Close"
                            ></button>
                        </div>
                        <p
                            className="text-base md:text-base whitespace-pre-wrap mb-6 text-secondary"
                            style={{
                                lineHeight: '1.6',
                                padding: '0 0.25rem',
                            }}
                        >
                            {selectedNote.content}
                        </p>
                        <div className="flex items-center text-sm md:text-xs mb-4 text-tertiary">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(selectedNote.lastEdited)}
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                            <Tag className="h-4 w-4 text-tertiary" />
                            {selectedNote.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="tag-pill inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
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
