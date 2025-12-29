import { useState, useEffect } from 'react';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('watchlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const toggleWatchlist = (code: string) => {
        setWatchlist(prev => {
            if (prev.includes(code)) {
                return prev.filter(c => c !== code);
            } else {
                return [...prev, code];
            }
        });
    };

    const isInWatchlist = (code: string) => watchlist.includes(code);

    return { watchlist, toggleWatchlist, isInWatchlist };
}
