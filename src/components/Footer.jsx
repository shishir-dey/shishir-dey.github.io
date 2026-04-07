import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center py-4 text-xs text-tertiary">
            <p>
                Copyright &copy; {new Date().getFullYear()} Shishir Dey - All
                rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
