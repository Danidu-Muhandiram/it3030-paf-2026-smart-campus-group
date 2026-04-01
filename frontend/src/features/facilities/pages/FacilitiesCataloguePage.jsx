import React, { useMemo, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { ResourceCard } from '../components/ResourceCard';
import { useNavigate } from 'react-router-dom';

const FAVOURITES_KEY = 'sc_fav_resources';

const loadFavourites = () => {
    try { return new Set(JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || []); }
    catch { return new Set(); }
};

const saveFavourites = (set) => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify([...set]));
};

// ---------------------------------------------------------------------------
// Mock data — replace with API call when backend endpoint is ready
// ---------------------------------------------------------------------------
const MOCK_RESOURCES = [
    { id: 1, name: 'Main Auditorium', type: 'Lecture Hall', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 2, name: 'B401 Computing Lab', type: 'Computer Lab', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 3, name: 'B401 Computing Lab', type: 'Computer Lab', location: 'Block B', capacity: 30, status: 'ACTIVE' },
    { id: 4, name: 'Projector #003', type: 'Projector', location: 'Block B', capacity: 50, status: 'OUT_OF_SERVICE' },
    { id: 5, name: 'Projector #001', type: 'Projector', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 6, name: 'B401 Computing Lab', type: 'Computer Lab', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 7, name: 'Projector #003', type: 'Projector', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 8, name: 'B401 Develop Nmoo', type: 'Lecture Hall', location: 'Block B', capacity: 50, status: 'OUT_OF_SERVICE' },
    { id: 9, name: 'Projector #003', type: 'Projector', location: 'Block B', capacity: 30, status: 'ACTIVE' },
    { id: 10, name: 'Main Auditorium', type: 'Lecture Hall', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 11, name: 'B401 Coming Lab', type: 'Computer Lab', location: 'Block B', capacity: 50, status: 'ACTIVE' },
    { id: 12, name: 'Projector Restanant', type: 'Projector', location: 'Block A', capacity: 50, status: 'ACTIVE' },
    { id: 13, name: 'Science Lab 01', type: 'Science Lab', location: 'Block A', capacity: 30, status: 'ACTIVE' },
    { id: 14, name: 'Meeting Room 5A', type: 'Meeting Room', location: 'Block A', capacity: 20, status: 'ACTIVE' },
    { id: 15, name: 'Workshop Bay 2', type: 'Workshop', location: 'Block C', capacity: 25, status: 'OUT_OF_SERVICE' },
    { id: 16, name: 'Lecture Hall 101', type: 'Lecture Hall', location: 'Block C', capacity: 120, status: 'ACTIVE' },
];

const PAGE_SIZE = 12;

// Derive unique option lists from data
const ALL_TYPES = [...new Set(MOCK_RESOURCES.map((r) => r.type))].sort();
const ALL_LOCATIONS = [...new Set(MOCK_RESOURCES.map((r) => r.location))].sort();

// ---------------------------------------------------------------------------
export const FacilitiesCataloguePage = () => {
    const navigate = useNavigate();

    // Favourites
    const [favourites, setFavourites] = useState(loadFavourites);
    const toggleFavourite = useCallback((id) => {
        setFavourites((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            saveFavourites(next);
            return next;
        });
    }, []);

    // Tab: 'all' | 'favourites'
    const [activeTab, setActiveTab] = useState('all');

    // Sort
    const [sortBy, setSortBy] = useState('default');

    // Filter state
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Derived filtered list
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        let list = MOCK_RESOURCES.filter((r) => {
            if (activeTab === 'favourites' && !favourites.has(r.id)) return false;
            if (q && !r.name.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q)) return false;
            if (selectedType && r.type !== selectedType) return false;
            if (selectedLocation && r.location !== selectedLocation) return false;
            if (selectedCapacity) {
                const cap = r.capacity ?? 0;
                if (selectedCapacity === '1-20' && !(cap >= 1 && cap <= 20)) return false;
                if (selectedCapacity === '21-50' && !(cap >= 21 && cap <= 50)) return false;
                if (selectedCapacity === '51-100' && !(cap >= 51 && cap <= 100)) return false;
                if (selectedCapacity === '100+' && !(cap > 100)) return false;
            }
            if (availableOnly && r.status !== 'ACTIVE') return false;
            return true;
        });
        if (sortBy === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === 'name-desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        if (sortBy === 'capacity-asc') list = [...list].sort((a, b) => (a.capacity ?? 0) - (b.capacity ?? 0));
        if (sortBy === 'capacity-desc') list = [...list].sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0));
        if (sortBy === 'available-first') list = [...list].sort((a) => (a.status === 'ACTIVE' ? -1 : 1));
        return list;
    }, [search, selectedType, selectedLocation, selectedCapacity, availableOnly, sortBy, activeTab, favourites]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const resetFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedLocation('');
        setSelectedCapacity('');
        setAvailableOnly(false);
        setCurrentPage(1);
    };

    const hasActiveFilters = search || selectedType || selectedLocation || selectedCapacity || availableOnly;

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main">Campus Facilities &amp; Assets Catalogue</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Browse all available halls, labs, campus equipments and other resources.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200">
                {[
                    { key: 'all', label: 'All Resources' },
                    { key: 'favourites', label: `My Favourites`, icon: Star, count: favourites.size },
                ].map(({ key, label, icon: Icon, count }) => (
                    <button
                        key={key}
                        onClick={() => { setActiveTab(key); setCurrentPage(1); }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-muted hover:text-text-main'
                        }`}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {label}
                        {count != null && count > 0 && (
                            <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded-full">{count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search Resources... (e.g., X502)"
                        value={search}
                        onChange={handleFilterChange(setSearch)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={selectedType}
                    onChange={handleFilterChange(setSelectedType)}
                    className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main bg-white appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                >
                    <option value="">All Types</option>
                    {ALL_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* Location Filter */}
                <select
                    value={selectedLocation}
                    onChange={handleFilterChange(setSelectedLocation)}
                    className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main bg-white appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                >
                    <option value="">All Locations</option>
                    {ALL_LOCATIONS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>

                {/* Capacity Filter */}
                <select
                    value={selectedCapacity}
                    onChange={handleFilterChange(setSelectedCapacity)}
                    className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main bg-white appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                >
                    <option value="">All Capacities</option>
                    <option value="1-20">1 – 20</option>
                    <option value="21-50">21 – 50</option>
                    <option value="51-100">51 – 100</option>
                    <option value="100+">100+</option>
                </select>

                {/* Available Only */}
                <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(e) => { setAvailableOnly(e.target.checked); setCurrentPage(1); }}
                        className="w-4 h-4 accent-primary rounded"
                    />
                    Available Only
                </label>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear
                    </button>
                )}

                {/* Results count + Sort */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-text-muted whitespace-nowrap">
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                        className="text-xs border border-gray-200 rounded-lg pl-2 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main bg-white appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.4rem center' }}
                    >
                        <option value="default">Sort: Default</option>
                        <option value="name-asc">Name A → Z</option>
                        <option value="name-desc">Name Z → A</option>
                        <option value="capacity-asc">Capacity: Low → High</option>
                        <option value="capacity-desc">Capacity: High → Low</option>
                        <option value="available-first">Available First</option>
                    </select>
                </div>
            </div>

            {/* Resource Grid */}
            {paginated.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginated.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            isFavourite={favourites.has(resource.id)}
                            onToggleFavourite={toggleFavourite}
                            onViewDetails={(r) => navigate(`/facilities/${r.id}`)}
                            onBook={(r) => navigate(`/dashboard/bookings/new?resourceId=${r.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-text-muted gap-3">
                    {activeTab === 'favourites' ? (
                        <>
                            <Star className="w-10 h-10 opacity-20" />
                            <p className="text-sm font-medium">No favourites yet.</p>
                            <button onClick={() => setActiveTab('all')} className="text-xs underline hover:text-primary transition-colors">
                                Browse all resources
                            </button>
                        </>
                    ) : (
                        <>
                            <SlidersHorizontal className="w-10 h-10 opacity-30" />
                            <p className="text-sm font-medium">No resources match your filters.</p>
                            <button onClick={resetFilters} className="text-xs underline hover:text-primary transition-colors">
                                Clear all filters
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const isEllipsis = totalPages > 7 && page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 2;
                        if (isEllipsis && (page === currentPage - 3 || page === currentPage + 3)) {
                            return <span key={page} className="px-1 text-text-muted text-sm">…</span>;
                        }
                        if (isEllipsis) return null;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                                    currentPage === page
                                        ? 'bg-primary text-white border-primary font-semibold'
                                        : 'border-gray-200 text-text-muted hover:border-primary hover:text-primary'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next &rsaquo;
                    </button>
                </div>
            )}
        </div>
    );
};
