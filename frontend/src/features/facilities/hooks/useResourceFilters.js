import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PAGE_SIZE = 12;

const applyCapacityFilter = (cap, range) => {
    if (!range) return true;
    if (range === '1-20')   return cap >= 1   && cap <= 20;
    if (range === '21-50')  return cap >= 21  && cap <= 50;
    if (range === '51-100') return cap >= 51  && cap <= 100;
    if (range === '100+')   return cap > 100;
    return true;
};

const applySort = (list, sortBy) => {
    switch (sortBy) {
        case 'name-asc':        return [...list].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':       return [...list].sort((a, b) => b.name.localeCompare(a.name));
        case 'capacity-asc':    return [...list].sort((a, b) => (a.capacity ?? 0) - (b.capacity ?? 0));
        case 'capacity-desc':   return [...list].sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0));
        case 'available-first': return [...list].sort((a) => (a.status === 'ACTIVE' ? -1 : 1));
        default:                return list;
    }
};

/**
 * Encapsulates all filter, sort, pagination, and URL-sync logic
 * for the Facilities Catalogue page.
 *
 * @param {Array}  resources  - Full list of resources to filter
 * @param {Set}    favourites - Set of bookmarked resource IDs
 * @param {string} activeTab  - 'all' | 'favourites'
 * @returns filter state + derived results
 */
export const useResourceFilters = (resources, favourites, activeTab) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search,           setSearch]           = useState(() => searchParams.get('q')        || '');
    const [selectedType,     setSelectedType]     = useState(() => searchParams.get('type')     || '');
    const [selectedLocation, setSelectedLocation] = useState(() => searchParams.get('location') || '');
    const [selectedCapacity, setSelectedCapacity] = useState(() => searchParams.get('capacity') || '');
    const [availableOnly,    setAvailableOnly]    = useState(() => searchParams.get('available') === 'true');
    const [sortBy,           setSortBy]           = useState(() => searchParams.get('sort')     || 'default');
    const [currentPage,      setCurrentPage]      = useState(() => parseInt(searchParams.get('page') || '1', 10));

    // Write filter state → URL query params (replaces history entry to avoid spam)
    useEffect(() => {
        const params = {};
        if (search)           params.q         = search;
        if (selectedType)     params.type      = selectedType;
        if (selectedLocation) params.location  = selectedLocation;
        if (selectedCapacity) params.capacity  = selectedCapacity;
        if (availableOnly)    params.available = 'true';
        if (sortBy !== 'default') params.sort  = sortBy;
        if (currentPage > 1)  params.page      = String(currentPage);
        setSearchParams(params, { replace: true });
    }, [search, selectedType, selectedLocation, selectedCapacity, availableOnly, sortBy, currentPage, setSearchParams]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();

        const base = resources.filter((r) => {
            if (activeTab === 'favourites' && !favourites.has(r.id)) return false;
            if (q && !r.name.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
            if (selectedType     && r.type     !== selectedType)     return false;
            if (selectedLocation && r.location !== selectedLocation) return false;
            if (!applyCapacityFilter(r.capacity ?? 0, selectedCapacity)) return false;
            if (availableOnly    && r.status   !== 'ACTIVE')         return false;
            return true;
        });

        return applySort(base, sortBy);
    }, [resources, search, selectedType, selectedLocation, selectedCapacity, availableOnly, sortBy, activeTab, favourites]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedLocation('');
        setSelectedCapacity('');
        setAvailableOnly(false);
        setCurrentPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    const hasActiveFilters = !!(search || selectedType || selectedLocation || selectedCapacity || availableOnly);

    return {
        // filter values
        search, selectedType, selectedLocation, selectedCapacity, availableOnly, sortBy,
        // setters
        setSearch, setSelectedType, setSelectedLocation, setSelectedCapacity,
        setAvailableOnly, setSortBy, setCurrentPage,
        // derived
        filtered, paginated, totalPages, currentPage,
        hasActiveFilters, resetFilters, handleFilterChange,
    };
};
