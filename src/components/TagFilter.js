import React from 'react';

const TagFilter = ({ allTags, selectedTags, setSelectedTags, darkMode }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-4">
            <div
                className="flex overflow-x-auto gap-2 mb-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() =>
                            setSelectedTags(prev =>
                                prev.includes(tag)
                                    ? prev.filter(t => t !== tag)
                                    : [...prev, tag]
                            )
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                            selectedTags.includes(tag)
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
    );
};

export default TagFilter;
