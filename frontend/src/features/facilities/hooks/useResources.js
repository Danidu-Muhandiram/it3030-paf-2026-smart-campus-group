import { useState, useEffect, useCallback } from 'react';
import { getAllAssets } from '../../../services/resourceService';

/**
 * Normalises a raw API asset into a flat shape that is safe to use throughout
 * the Facilities Catalogue (filters, cards, drawer).
 *
 * Raw API shape:
 *   { id, name, description, imageUrl, capacity, status,
 *     type:     { id, name },
 *     location: { id, name, buildingName } }
 *
 * Normalised shape exposed to the UI:
 *   { id, name, description, imageUrl, capacity, status,
 *     type,             // string — type.name   (e.g. "Computer Lab")
 *     typeId,           // number
 *     location,         // string — location.name (e.g. "Block B")
 *     locationId,       // number
 *     locationBuilding, // string — location.buildingName or ''
 *   }
 */
export const normaliseAsset = (raw) => ({
    id:               raw.id,
    name:             raw.name ?? '',
    description:      raw.description ?? '',
    imageUrl:         raw.imageUrl ?? null,
    capacity:         raw.capacity ?? 0,
    status:           raw.status ?? 'ACTIVE',
    type:             raw.type?.name    ?? raw.type    ?? '',
    typeId:           raw.type?.id      ?? null,
    location:         raw.location?.name ?? raw.location ?? '',
    locationId:       raw.location?.id   ?? null,
    locationBuilding: raw.location?.buildingName ?? '',
});

/**
 * Fetches all assets from the API and exposes normalised data.
 *
 * Returns:
 *   resources  — normalised asset array
 *   loading    — true while fetching
 *   error      — error message string or null
 *   refetch()  — manually re-trigger the fetch
 */
export const useResources = () => {
    const [resources, setResources] = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = await getAllAssets();
            setResources((raw ?? []).map(normaliseAsset));
        } catch (err) {
            console.error('[useResources] failed to fetch assets:', err);
            setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load resources.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    return { resources, loading, error, refetch: fetchResources };
};
