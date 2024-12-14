import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pin, X, Tag, Clock, Moon, Sun, Search, Mail } from 'lucide-react';

const DiaryViewer = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get all unique tags
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Filter notes based on selected tags
    const filteredNotes = useMemo(() => {
        return notes.filter(note =>
            selectedTags.length === 0 ||
            selectedTags.every(tag => note.tags.includes(tag))
        ).sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.lastEdited) - new Date(a.lastEdited);
        });
    }, [notes, selectedTags]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectedNote(null);
            document.body.style.overflow = '';
        }, 200);
    }, []);

    const openModal = useCallback((note) => {
        setSelectedNote(note);
        setModalVisible(true);
        document.body.style.overflow = 'hidden';
    }, []);

    // Load notes effect
    useEffect(() => {
        const loadNotes = async () => {
            try {
                const response = await fetch('/content/notes/notes.json');
                if (!response.ok) throw new Error('Failed to fetch notes.json');
                const files = await response.json();

                const notesData = await Promise.all(
                    files.map(async (filename) => {
                        const fileResponse = await fetch(`/content/notes/${filename}`);
                        if (!fileResponse.ok) throw new Error(`Failed to fetch note: ${filename}`);
                        const content = await fileResponse.text();

                        // More lenient frontmatter parsing
                        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

                        if (!frontmatterMatch) {
                            // If no frontmatter, treat entire content as body
                            return {
                                id: filename,
                                title: filename.replace('.md', ''),
                                date: new Date(),
                                lastEdited: new Date(),
                                tags: [],
                                isPinned: false,
                                content: content.trim()
                            };
                        }

                        const [_, frontmatter, mainContent] = frontmatterMatch;

                        // More forgiving metadata extraction
                        const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]*)["']?/);
                        const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n]*)["']?/);
                        const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
                        const pinnedMatch = frontmatter.match(/pinned:\s*(true|false)/);
                        const urlMatch = frontmatter.match(/url:\s*["']?([^"'\n]*)["']?/);

                        return {
                            id: filename,
                            title: titleMatch ? titleMatch[1].trim() : filename.replace('.md', ''),
                            url: urlMatch ? urlMatch[1].trim() : null,
                            date: dateMatch ? new Date(dateMatch[1]) : new Date(),
                            lastEdited: dateMatch ? new Date(dateMatch[1]) : new Date(),
                            tags: tagsMatch
                                ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''))
                                : [],
                            isPinned: pinnedMatch ? pinnedMatch[1] === 'true' : false,
                            content: mainContent.trim()
                        };
                    })
                );

                const sortedNotes = notesData.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return b.date - a.date;
                });

                setNotes(sortedNotes);
            } catch (error) {
                console.error('Error loading notes:', error);
                setNotes([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotes();
    }, []);

    // Keyboard navigation effect
    useEffect(() => {
        if (!selectedNote) return; // Only add listener if there's a selected note

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const currentIndex = filteredNotes.findIndex(note => note.id === selectedNote.id);
                let newIndex;
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : filteredNotes.length - 1;
                } else {
                    newIndex = currentIndex < filteredNotes.length - 1 ? currentIndex + 1 : 0;
                }
                setSelectedNote(filteredNotes[newIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNote, filteredNotes, closeModal]);

    if (isLoading) {
        return <div style={loadingStyle} />;
    }

    // Apple-style loading animation CSS
    const loadingStyle = {
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50px',
        height: '50px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    // Add keyframe animation
    if (isLoading) {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Show loading animation while fetching
    if (isLoading) {
        return <div style={loadingStyle} />;
    }

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

    return (
        <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
            }`}>
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl md:text-2xl font-bold">Shishir Dey.</h1>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://shishirdey.com/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                    }`}
                            >
                                <Mail className="h-6 w-6" />
                            </a>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                    }`}
                            >
                                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Tag Filter */}
                    <div className="flex overflow-x-auto gap-2 mb-4">
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
                                                onClick={(e) => e.stopPropagation()}
                                                className={`inline-flex items-center text-sm md:text-xs tracking-wide font-semibold no-underline -mt-1
                                                    ${darkMode
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
                                        <Pin className="text-blue-500 h-5 w-5 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                                <p className={`text-base md:text-sm line-clamp-3 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {note.content}
                                </p>
                                <div className={`flex items-center text-sm md:text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    <Clock className="h-4 w-4 md:h-3 md:w-3 mr-1" />
                                    {formatDate(note.lastEdited)}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm md:text-xs font-medium ${darkMode
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
                                                            ${darkMode
                                                                ? 'text-amber-300 hover:text-amber-200'
                                                                : 'text-amber-600 hover:text-amber-700'
                                                            } transition-colors duration-200 font-sans`}
                                                    >
                                                        <span>View</span>
                                                        <span className="ml-1 text-[10px]">↗</span>
                                                    </a>
                                                )}
                                            </div>
                                            {selectedNote.isPinned && (
                                                <Pin className="text-blue-500 h-5 w-5 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className={`text-base md:text-sm whitespace-pre-wrap mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {selectedNote.content}
                                </p>
                                <div className={`flex items-center text-sm md:text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    <Clock className="h-3 w-3 mr-1" />
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

            <footer className={`text-center py-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Copyright &copy; {new Date().getFullYear()} Shishir Dey - All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DiaryViewer;