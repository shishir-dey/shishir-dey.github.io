import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="loading-orb" role="status" aria-live="polite">
            <span className="sr-only">Loading</span>
        </div>
    );
};

export default LoadingSpinner;
