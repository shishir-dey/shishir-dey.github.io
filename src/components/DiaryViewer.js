import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './Header';
import TagFilter from './TagFilter';
import NotesGrid from './NotesGrid';
import NoteModal from './NoteModal';
import LoadingSpinner from './LoadingSpinner';
import Footer from './Footer';

const DiaryViewer = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from localStorage, default to false if not set
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme === 'true';
    });
    const [selectedTags, setSelectedTags] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Save darkMode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Get all unique tags
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

    // Filter notes based on selected tags
    const filteredNotes = useMemo(() => {
        return notes
            .filter(
                note =>
                    selectedTags.length === 0 ||
                    selectedTags.every(tag => note.tags.includes(tag))
            )
            .sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.lastEdited) - new Date(a.lastEdited);
            });
    }, [notes, selectedTags]);

    const closeModal = useCallback(options => {
        const fromPopState = options && options.fromPopState === true;
        setModalVisible(false);
        setTimeout(() => {
            setSelectedNote(null);
            document.body.style.overflow = '';
        }, 200);
        // If this close wasn't triggered by a browser back (popstate),
        // go back one step to consume the history entry we pushed when opening the modal.
        if (!fromPopState) {
            try {
                if (window.history.state && window.history.state.modalOpen) {
                    window.history.back();
                }
            } catch (_) {
                // noop
            }
        }
    }, []);

    const openModal = useCallback(
        note => {
            setSelectedNote(note);
            setModalVisible(true);
            document.body.style.overflow = 'hidden';
            // Push a history state so that the browser back button closes the modal first
            try {
                if (!modalVisible) {
                    window.history.pushState({ modalOpen: true }, '');
                }
            } catch (_) {
                // noop
            }
        },
        [modalVisible]
    );

    // Load notes effect
    useEffect(() => {
        const loadNotes = async () => {
            try {
                const response = await fetch('/content/notes/metadata.json');
                if (!response.ok)
                    throw new Error('Failed to fetch notes/metadata.json');
                const files = await response.json();

                const notesData = await Promise.all(
                    files.map(async filename => {
                        const fileResponse = await fetch(
                            `/content/notes/${filename}`
                        );
                        if (!fileResponse.ok)
                            throw new Error(
                                `Failed to fetch note: ${filename}`
                            );
                        const content = await fileResponse.text();

                        // More lenient frontmatter parsing
                        const frontmatterMatch = content.match(
                            /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
                        );

                        if (!frontmatterMatch) {
                            // If no frontmatter, treat entire content as body
                            return {
                                id: filename,
                                title: filename.replace('.md', ''),
                                date: new Date(),
                                lastEdited: new Date(),
                                tags: [],
                                isPinned: false,
                                content: content.trim(),
                            };
                        }

                        const [_, frontmatter, mainContent] = frontmatterMatch;

                        // More forgiving metadata extraction
                        const titleMatch = frontmatter.match(
                            /title:\s*["']?([^"'\n]*)["']?/
                        );
                        const dateMatch = frontmatter.match(
                            /date:\s*["']?([^"'\n]*)["']?/
                        );
                        const tagsMatch =
                            frontmatter.match(/tags:\s*\[(.*?)\]/);
                        const pinnedMatch = frontmatter.match(
                            /pinned:\s*(true|false)/
                        );
                        const urlMatch = frontmatter.match(
                            /url:\s*["']?([^"'\n]*)["']?/
                        );

                        return {
                            id: filename,
                            title: titleMatch
                                ? titleMatch[1].trim()
                                : filename.replace('.md', ''),
                            url: urlMatch ? urlMatch[1].trim() : null,
                            date: dateMatch
                                ? new Date(dateMatch[1])
                                : new Date(),
                            lastEdited: dateMatch
                                ? new Date(dateMatch[1])
                                : new Date(),
                            tags: tagsMatch
                                ? tagsMatch[1]
                                      .split(',')
                                      .map(tag =>
                                          tag.trim().replace(/['"]/g, '')
                                      )
                                : [],
                            isPinned: pinnedMatch
                                ? pinnedMatch[1] === 'true'
                                : false,
                            content: mainContent.trim(),
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

        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const currentIndex = filteredNotes.findIndex(
                    note => note.id === selectedNote.id
                );
                let newIndex;
                if (e.key === 'ArrowLeft') {
                    newIndex =
                        currentIndex > 0
                            ? currentIndex - 1
                            : filteredNotes.length - 1;
                } else {
                    newIndex =
                        currentIndex < filteredNotes.length - 1
                            ? currentIndex + 1
                            : 0;
                }
                setSelectedNote(filteredNotes[newIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNote, filteredNotes, closeModal]);

    // Close modal on browser back button (popstate)
    useEffect(() => {
        const handlePopState = () => {
            if (modalVisible) {
                closeModal({ fromPopState: true });
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [modalVisible, closeModal]);

    // Format date to be more readable
    const formatDate = dateString => {
        const date = new Date(dateString);
        const isTimeSet =
            date.getHours() !== 0 ||
            date.getMinutes() !== 0 ||
            date.getSeconds() !== 0;

        if (isTimeSet) {
            // Show both date and time if time is specifically set
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            // Only show date if time is midnight (00:00:00)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-200 ${
                darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
            }`}
        >
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            <TagFilter
                allTags={allTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                darkMode={darkMode}
            />

            <NotesGrid
                filteredNotes={filteredNotes}
                darkMode={darkMode}
                formatDate={formatDate}
                onNoteClick={openModal}
            />

            <NoteModal
                selectedNote={selectedNote}
                modalVisible={modalVisible}
                darkMode={darkMode}
                formatDate={formatDate}
                onClose={closeModal}
            />

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default DiaryViewer;
