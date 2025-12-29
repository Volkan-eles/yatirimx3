import React from 'react';

interface BlogFilterProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

export const BlogFilter: React.FC<BlogFilterProps> = ({
    categories,
    activeCategory,
    onSelectCategory
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8 animate-in slide-in-from-left-4 duration-500">
            <button
                onClick={() => onSelectCategory('Tümü')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeCategory === 'Tümü'
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                Tümü
            </button>

            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeCategory === category
                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                            : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};
