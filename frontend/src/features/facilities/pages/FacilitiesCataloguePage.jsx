import React, { useMemo, useState } from 'react';
import { AlertCircle, Loader2, Star, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ResourceCard }         from '../components/ResourceCard';
import { FilterBar }            from '../components/FilterBar';
import { CataloguePagination }  from '../components/CataloguePagination';
import { ResourceDetailDrawer } from '../components/ResourceDetailDrawer';
import { useFavourites }        from '../hooks/useFavourites';
import { useResources }         from '../hooks/useResources';
import { useResourceFilters }   from '../hooks/useResourceFilters';

// ---------------------------------------------------------------------------
// Tabs config
// ---------------------------------------------------------------------------
const TABS = [
    { key: 'all',        label: 'All Resources' },
    { key: 'favourites', label: 'My Favourites', icon: Star },
];

// ---------------------------------------------------------------------------
export const FacilitiesCataloguePage = () => {
    const navigate = useNavigate();

    const [activeTab,        setActiveTab]        = useState('all');
    const [viewMode,         setViewMode]         = useState('grid');
    const [selectedResource, setSelectedResource] = useState(null);

    // ── Live data ──────────────────────────────────────────────────────────
    const { resources, loading, error, refetch } = useResources();

    // Derive unique sorted filter options from live data
    const TYPE_OPTIONS     = useMemo(() => [...new Set(resources.map((r) => r.type))].sort((a, b) => a.localeCompare(b)),     [resources]);
    const LOCATION_OPTIONS = useMemo(() => [...new Set(resources.map((r) => r.location))].sort((a, b) => a.localeCompare(b)), [resources]);

    // ── Filters & favourites ───────────────────────────────────────────────
    const { favourites, toggleFavourite } = useFavourites();
    const filters = useResourceFilters(resources, favourites, activeTab);

    const {
        search, selectedType, selectedLocation, selectedCapacity,
        availableOnly, sortBy,
        setSearch, setSelectedType, setSelectedLocation, setSelectedCapacity,
        setAvailableOnly, setSortBy, setCurrentPage,
        filtered, paginated, totalPages, currentPage,
        hasActiveFilters, resetFilters, handleFilterChange,
    } = filters;

    // ── Actions ────────────────────────────────────────────────────────────
    const navigateToBook = (r) => navigate(`/dashboard/bookings/new?resourceId=${r.id}`);
    const openDetails    = (r) => setSelectedResource(r);
    const closeDetails   = ()  => setSelectedResource(null);

    return (
        <div className="space-y-4 sm:space-y-6 pb-10 px-0">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">
                    Campus Facilities &amp; Assets Catalogue
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-text-muted">
                    Browse all available halls, labs, and campus equipment.
                </p>
            </div>

            {/* Tabs — horizontally scrollable on mobile */}
            <div className="flex items-center gap-1 border-b border-gray-200 -mx-1 px-1 overflow-x-auto scrollbar-none">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => { setActiveTab(key); setCurrentPage(1); }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                            activeTab === key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-muted hover:text-text-main'
                        }`}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {label}
                        {key === 'favourites' && favourites.size > 0 && (
                            <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded-full">
                                {favourites.size}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="flex items-center justify-center py-24 gap-3 text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-sm">Loading resources…</span>
                </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-text-main">Could not load resources</p>
                    <p className="text-xs text-text-muted">{error}</p>
                    <button onClick={refetch} className="mt-1 text-xs font-semibold text-primary hover:underline">
                        Try again
                    </button>
                </div>
            )}

            {/* ── Main content ── */}
            {!loading && !error && (
                <>
                    <FilterBar
                        search={search}
                        selectedType={selectedType}
                        selectedLocation={selectedLocation}
                        selectedCapacity={selectedCapacity}
                        availableOnly={availableOnly}
                        sortBy={sortBy}
                        viewMode={viewMode}
                        resultCount={filtered.length}
                        hasActiveFilters={hasActiveFilters}
                        typeOptions={TYPE_OPTIONS}
                        locationOptions={LOCATION_OPTIONS}
                        onSearchChange={handleFilterChange(setSearch)}
                        onTypeChange={handleFilterChange(setSelectedType)}
                        onLocationChange={handleFilterChange(setSelectedLocation)}
                        onCapacityChange={handleFilterChange(setSelectedCapacity)}
                        onAvailableOnlyChange={(e) => { setAvailableOnly(e.target.checked); setCurrentPage(1); }}
                        onSortChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                        onViewModeChange={setViewMode}
                        onResetFilters={resetFilters}
                    />

                    {paginated.length > 0 ? (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
                                : 'flex flex-col gap-2'
                        }>
                            {paginated.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    listView={viewMode === 'list'}
                                    isFavourite={favourites.has(resource.id)}
                                    onToggleFavourite={toggleFavourite}
                                    onViewDetails={openDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            activeTab={activeTab}
                            hasFilters={hasActiveFilters}
                            onBrowseAll={() => setActiveTab('all')}
                            onClearFilters={resetFilters}
                        />
                    )}

                    <CataloguePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Resource detail drawer — rendered outside main so it always overlays */}
            <ResourceDetailDrawer
                resource={selectedResource}
                isFavourite={selectedResource ? favourites.has(selectedResource.id) : false}
                onToggleFavourite={toggleFavourite}
                onBook={(r) => { closeDetails(); navigateToBook(r); }}
                onClose={closeDetails}
            />
        </div>
    );
};

// ---------------------------------------------------------------------------
// Empty state helper â€” kept in this file as it's page-specific UI
// ---------------------------------------------------------------------------
const EmptyState = ({ activeTab, hasFilters, onBrowseAll, onClearFilters }) => (
    <div className="flex flex-col items-center justify-center py-24 text-text-muted gap-3">
        {activeTab === 'favourites' ? (
            <>
                <Star className="w-10 h-10 opacity-20" />
                <p className="text-sm font-medium">No favourites yet.</p>
                <button onClick={onBrowseAll} className="text-xs underline hover:text-primary transition-colors">
                    Browse all resources
                </button>
            </>
        ) : (
            <>
                <SlidersHorizontal className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">
                    {hasFilters ? 'No resources match your filters.' : 'No resources found.'}
                </p>
                {hasFilters && (
                    <button onClick={onClearFilters} className="text-xs underline hover:text-primary transition-colors">
                        Clear all filters
                    </button>
                )}
            </>
        )}
    </div>
);


