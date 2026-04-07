import React from 'react';

const TagFilter = ({ allTags, selectedTags, setSelectedTags }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="tag-scroll-wrap mb-2">
                <div
                    className="tag-scroll flex gap-2"
                    style={{
                        msOverflowStyle: 'none',
                    }}
                >
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() =>
                                setSelectedTags(prev =>
                                    prev.includes(tag)
                                        ? prev.filter(t => t !== tag)
                                        : [...prev, tag]
                                )
                            }
                            className={`glass-chip inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap ${
                                selectedTags.includes(tag) ? 'active' : ''
                            }`}
                            aria-pressed={selectedTags.includes(tag)}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagFilter;
