import React from 'react';

const Footer = ({ darkMode }) => {
    return (
        <footer
            className={`text-center py-4 text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
        >
            <p>
                Copyright &copy; {new Date().getFullYear()} Shishir Dey - All
                rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
