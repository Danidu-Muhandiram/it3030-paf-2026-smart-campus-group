import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sc_fav_resources';

const load = () => {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []);
    } catch {
        return new Set();
    }
};

const save = (set) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

/**
 * Manages a persisted set of favourite resource IDs.
 *
 * @returns {{ favourites: Set<number>, toggleFavourite: (id: number) => void }}
 */
export const useFavourites = () => {
    const [favourites, setFavourites] = useState(load);

    const toggleFavourite = useCallback((id) => {
        setFavourites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            save(next);
            return next;
        });
    }, []);

    return { favourites, toggleFavourite };
};
