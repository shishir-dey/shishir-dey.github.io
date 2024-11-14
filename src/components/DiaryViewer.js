import React, { useState, useEffect } from 'react';
import { Pin, X, Tag, Clock, Moon, Sun, Search } from 'lucide-react';

const DiaryViewer = () => {
    const [notes] = useState([
        {
            id: 1,
            title: "Hola!",
            body: "My name is Shishir, and I am an embedded systems designer. I enjoy engaging with the technology community and connecting with others who share my passions. I enjoy scrolling through memes, watching movies and reading articles. I am happy you have stumbled upon my site, and I hope you find something of interest. Thank you for visiting!",
            isPinned: true,
            lastEdited: "2024-11-14T18:30:00",
            tags: ["personal"]
        }
    ]);

    const [selectedNote, setSelectedNote] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Get all unique tags
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedNote) {
                closeModal();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (selectedNote) {
                    const currentIndex = filteredNotes.findIndex(note => note.id === selectedNote.id);
                    let newIndex;
                    if (e.key === 'ArrowLeft') {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : filteredNotes.length - 1;
                    } else {
                        newIndex = currentIndex < filteredNotes.length - 1 ? currentIndex + 1 : 0;
                    }
                    setSelectedNote(filteredNotes[newIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNote]);

    // Format date to be more readable
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter notes based on selected tags
    const filteredNotes = notes.filter(note =>
        selectedTags.length === 0 ||
        selectedTags.every(tag => note.tags.includes(tag))
    ).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.lastEdited) - new Date(a.lastEdited);
    });

    const openModal = (note) => {
        setSelectedNote(note);
        setModalVisible(true);
        // Add class to prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedNote(null);
            document.body.style.overflow = '';
        }, 200);
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
            }`}>
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">Shishir Dey.</h1>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                }`}
                        >
                            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Tag Filter */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTags(prev =>
                                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                )}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${selectedTags.includes(tag)
                                    ? 'bg-blue-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Notes Grid */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => openModal(note)}
                            className={`rounded-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${darkMode
                                ? 'bg-gray-800 hover:shadow-lg hover:shadow-blue-500/20'
                                : 'bg-white hover:shadow-lg hover:shadow-blue-500/20'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-xl font-semibold line-clamp-2">
                                        {note.title}
                                    </h2>
                                    {note.isPinned && (
                                        <Pin className="text-blue-500 h-5 w-5 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                                <p className={`line-clamp-3 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {note.body}
                                </p>
                                <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formatDate(note.lastEdited)}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode
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
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedNote && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${modalVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={closeModal}
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                    <div
                        className={`relative w-full max-w-2xl transform transition-all duration-200 ${modalVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`rounded-lg max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start flex-1">
                                        <h2 className="text-2xl font-semibold mr-3">
                                            {selectedNote.title}
                                        </h2>
                                        {selectedNote.isPinned && (
                                            <Pin className="text-blue-500 h-5 w-5 flex-shrink-0" />
                                        )}
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className={`whitespace-pre-wrap mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {selectedNote.body}
                                </p>
                                <div className={`flex items-center text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formatDate(selectedNote.lastEdited)}
                                </div>
                                <div className="flex items-center flex-wrap gap-2">
                                    <Tag className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                    {selectedNote.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode
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
            )}

            <footer className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Copyright &copy; {new Date().getFullYear()} Shishir Dey - All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DiaryViewer;