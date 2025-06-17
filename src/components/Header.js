import React from 'react';
import { Moon, Sun, Mail } from 'lucide-react';

const Header = ({ darkMode, setDarkMode }) => {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 shadow-xs">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl md:text-2xl font-bold">
                        Shishir Dey.
                    </h1>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://shishirdey.com/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full ${
                                darkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-200'
                            }`}
                        >
                            <Mail className="h-6 w-6" />
                        </a>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full ${
                                darkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-200'
                            }`}
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
