import React from 'react';
import NoteCard from './NoteCard';

const NotesGrid = ({ filteredNotes, darkMode, formatDate, onNoteClick }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        darkMode={darkMode}
                        formatDate={formatDate}
                        onNoteClick={onNoteClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesGrid;
