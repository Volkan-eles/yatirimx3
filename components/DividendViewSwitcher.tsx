import React, { useState } from 'react';
import { Calendar, Grid, List, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DividendViewSwitcherProps {
    currentView: 'calendar' | 'list' | 'timeline' | 'cards';
    onViewChange: (view: 'calendar' | 'list' | 'timeline' | 'cards') => void;
}

const DividendViewSwitcher: React.FC<DividendViewSwitcherProps> = ({
    currentView,
    onViewChange,
}) => {
    const views = [
        { id: 'calendar' as const, label: 'Takvim', icon: Calendar },
        { id: 'cards' as const, label: 'Kartlar', icon: Grid },
        { id: 'list' as const, label: 'Liste', icon: List },
        { id: 'timeline' as const, label: 'Zaman Çizelgesi', icon: Clock },
    ];

    return (
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/10">
            {views.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;

                return (
                    <button
                        key={view.id}
                        onClick={() => onViewChange(view.id)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                                ? 'text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeView"
                                className="absolute inset-0 bg-blue-600 rounded-lg"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 hidden sm:inline">{view.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default DividendViewSwitcher;
