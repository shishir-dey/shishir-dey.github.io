import React from 'react';
import { Moon, Sun, Mail } from 'lucide-react';

const Header = ({ darkMode, setDarkMode }) => {
    return (
        <header className="sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-2 md:py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-2xl font-semibold tracking-tight flex items-center text-primary">
                        Shishir Dey.
                    </h1>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://shishirdey.com/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-button"
                            aria-label="Contact"
                        >
                            <Mail className="h-6 w-6" />
                        </a>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="icon-button"
                            aria-label="Toggle theme"
                        >
                            {darkMode ? (
                                <Sun className="h-6 w-6" />
                            ) : (
                                <Moon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
