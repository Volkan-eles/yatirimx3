import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Filter, X, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DividendFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    search: string;
    dateRange: { start: string; end: string };
    types: string[];
    sectors: string[];
    yieldRange: { min: number; max: number };
    status: 'all' | 'upcoming' | 'paid';
}

const DIVIDEND_TYPES = [
    { value: 'nakit', label: 'Nakit' },
    { value: 'bedelsiz', label: 'Bedelsiz' },
    { value: 'karma', label: 'Karma' },
];

const SECTORS = [
    'Bankacılık',
    'Holding',
    'Enerji',
    'Ulaştırma',
    'Teknoloji',
    'Perakende',
    'İnşaat',
    'Gıda',
];

const QUICK_DATES = [
    { label: 'Bu Ay', value: 'this-month' },
    { label: 'Gelecek Ay', value: 'next-month' },
    { label: 'Bu Çeyrek', value: 'this-quarter' },
    { label: 'Bu Yıl', value: 'this-year' },
];

const DividendFilters: React.FC<DividendFiltersProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        dateRange: { start: '', end: '' },
        types: [],
        sectors: [],
        yieldRange: { min: 0, max: 15 },
        status: 'all',
    });

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.dateRange.start || filters.dateRange.end) count++;
        if (filters.types.length > 0) count++;
        if (filters.sectors.length > 0) count++;
        if (filters.yieldRange.min > 0 || filters.yieldRange.max < 15) count++;
        if (filters.status !== 'all') count++;
        return count;
    }, [filters]);

    const updateFilters = (newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange(updated);
    };

    const toggleType = (type: string) => {
        const newTypes = filters.types.includes(type)
            ? filters.types.filter(t => t !== type)
            : [...filters.types, type];
        updateFilters({ types: newTypes });
    };

    const toggleSector = (sector: string) => {
        const newSectors = filters.sectors.includes(sector)
            ? filters.sectors.filter(s => s !== sector)
            : [...filters.sectors, sector];
        updateFilters({ sectors: newSectors });
    };

    const setQuickDate = (value: string) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (value) {
            case 'this-month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'next-month':
                start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                break;
            case 'this-quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                start = new Date(today.getFullYear(), quarter * 3, 1);
                end = new Date(today.getFullYear(), quarter * 3 + 3, 0);
                break;
            case 'this-year':
                start = new Date(today.getFullYear(), 0, 1);
                end = new Date(today.getFullYear(), 11, 31);
                break;
        }

        updateFilters({
            dateRange: {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0],
            },
        });
    };

    const clearFilters = () => {
        const defaultFilters: FilterState = {
            search: '',
            dateRange: { start: '', end: '' },
            types: [],
            sectors: [],
            yieldRange: { min: 0, max: 15 },
            status: 'all',
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="space-y-4">
            {/* Filter Toggle Button */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg hover:border-blue-500/50 transition-all"
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-bold">Filtreler</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        placeholder="Hisse kodu veya şirket adı ara..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
                    />
                </div>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all text-rose-400 text-sm font-bold"
                    >
                        Temizle
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Tarih Aralığı</label>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        value={filters.dateRange.start}
                                        onChange={(e) =>
                                            updateFilters({
                                                dateRange: { ...filters.dateRange, start: e.target.value },
                                            })
                                        }
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateRange.end}
                                        onChange={(e) =>
                                            updateFilters({
                                                dateRange: { ...filters.dateRange, end: e.target.value },
                                            })
                                        }
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {QUICK_DATES.map((quick) => (
                                        <button
                                            key={quick.value}
                                            onClick={() => setQuickDate(quick.value)}
                                            className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-all"
                                        >
                                            {quick.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dividend Types */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Temettü Tipi</label>
                                <div className="space-y-2">
                                    {DIVIDEND_TYPES.map((type) => (
                                        <label
                                            key={type.value}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.types.includes(type.value)}
                                                onChange={() => toggleType(type.value)}
                                                className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-blue-500 focus:ring-blue-500/50"
                                            />
                                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                {type.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sectors */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Sektör</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    {SECTORS.map((sector) => (
                                        <label
                                            key={sector}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.sectors.includes(sector)}
                                                onChange={() => toggleSector(sector)}
                                                className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-blue-500 focus:ring-blue-500/50"
                                            />
                                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                {sector}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Yield Range */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">
                                    Getiri Oranı (%{filters.yieldRange.min} - %{filters.yieldRange.max})
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="0.5"
                                        value={filters.yieldRange.min}
                                        onChange={(e) =>
                                            updateFilters({
                                                yieldRange: { ...filters.yieldRange, min: Number(e.target.value) },
                                            })
                                        }
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="0.5"
                                        value={filters.yieldRange.max}
                                        onChange={(e) =>
                                            updateFilters({
                                                yieldRange: { ...filters.yieldRange, max: Number(e.target.value) },
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-3">Durum</label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'Tümü' },
                                        { value: 'upcoming', label: 'Bekleyen' },
                                        { value: 'paid', label: 'Ödendi' },
                                    ].map((status) => (
                                        <label
                                            key={status.value}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={filters.status === status.value}
                                                onChange={() => updateFilters({ status: status.value as any })}
                                                className="w-4 h-4 border-white/20 bg-zinc-900 text-blue-500 focus:ring-blue-500/50"
                                            />
                                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                {status.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DividendFilters;
