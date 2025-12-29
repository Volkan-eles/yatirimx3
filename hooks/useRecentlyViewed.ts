import { useState, useEffect } from 'react';

interface RecentlyViewedStock {
    code: string;
    name: string;
    timestamp: number;
}

const MAX_RECENT = 10;
const STORAGE_KEY = 'yatirimx_recently_viewed';

export const useRecentlyViewed = () => {
    const [recentStocks, setRecentStocks] = useState<RecentlyViewedStock[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentStocks(JSON.parse(stored));
            } catch (e) {
                console.error('Error loading recently viewed:', e);
            }
        }
    }, []);

    const addToRecent = (code: string, name: string) => {
        const newStock: RecentlyViewedStock = {
            code,
            name,
            timestamp: Date.now(),
        };

        const filtered = recentStocks.filter(s => s.code !== code);
        const updated = [newStock, ...filtered].slice(0, MAX_RECENT);

        setRecentStocks(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const clearRecent = () => {
        setRecentStocks([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        recentStocks,
        addToRecent,
        clearRecent,
    };
};
