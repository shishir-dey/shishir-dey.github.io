// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import DiaryViewer from './components/DiaryViewer';

const App = () => {
    return (
        <div className="min-h-screen">
            <DiaryViewer />
        </div>
    );
};

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);