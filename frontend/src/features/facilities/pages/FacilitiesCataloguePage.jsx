import React, { useState } from 'react';
import { Star, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ResourceCard }          from '../components/ResourceCard';
import { FilterBar }             from '../components/FilterBar';
import { CataloguePagination }   from '../components/CataloguePagination';
import { ResourceDetailDrawer }  from '../components/ResourceDetailDrawer';
import { useFavourites }         from '../hooks/useFavourites';
import { useResourceFilters }    from '../hooks/useResourceFilters';

// ---------------------------------------------------------------------------
// TODO: Replace MOCK_RESOURCES with an API call via resourceService.getAllAssets()
// ---------------------------------------------------------------------------
const MOCK_RESOURCES = [
    { id: 1,  name: 'Main Auditorium',        type: 'Lecture Hall',  location: 'Block B', capacity: 200, status: 'ACTIVE'         },
    { id: 2,  name: 'B401 Computing Lab',     type: 'Computer Lab',  location: 'Block B', capacity: 50,  status: 'ACTIVE'         },
    { id: 3,  name: 'B305 Computing Lab',     type: 'Computer Lab',  location: 'Block B', capacity: 30,  status: 'ACTIVE'         },
    { id: 4,  name: 'Projector #003',         type: 'Projector',     location: 'Block B', capacity: 1,   status: 'OUT_OF_SERVICE'  },
    { id: 5,  name: 'Projector #001',         type: 'Projector',     location: 'Block B', capacity: 1,   status: 'ACTIVE'         },
    { id: 6,  name: 'B402 Computing Lab',     type: 'Computer Lab',  location: 'Block B', capacity: 50,  status: 'ACTIVE'         },
    { id: 7,  name: 'Projector #007',         type: 'Projector',     location: 'Block B', capacity: 1,   status: 'ACTIVE'         },
    { id: 8,  name: 'Block B Seminar Room',   type: 'Lecture Hall',  location: 'Block B', capacity: 50,  status: 'OUT_OF_SERVICE'  },
    { id: 9,  name: 'Projector #009',         type: 'Projector',     location: 'Block B', capacity: 1,   status: 'ACTIVE'         },
    { id: 10, name: 'Lecture Hall B202',      type: 'Lecture Hall',  location: 'Block B', capacity: 80,  status: 'ACTIVE'         },
    { id: 11, name: 'B403 Computing Lab',     type: 'Computer Lab',  location: 'Block B', capacity: 50,  status: 'ACTIVE'         },
    { id: 12, name: 'Block A Projector',      type: 'Projector',     location: 'Block A', capacity: 1,   status: 'ACTIVE'         },
    { id: 13, name: 'Science Lab 01',         type: 'Science Lab',   location: 'Block A', capacity: 30,  status: 'ACTIVE'         },
    { id: 14, name: 'Meeting Room 5A',        type: 'Meeting Room',  location: 'Block A', capacity: 20,  status: 'ACTIVE'         },
    { id: 15, name: 'Workshop Bay 2',         type: 'Workshop',      location: 'Block C', capacity: 25,  status: 'OUT_OF_SERVICE'  },
    { id: 16, name: 'Lecture Hall C101',      type: 'Lecture Hall',  location: 'Block C', capacity: 120, status: 'ACTIVE'         },
];

// Derive unique sorted option lists once at module level
const TYPE_OPTIONS     = [...new Set(MOCK_RESOURCES.map((r) => r.type))].sort();
const LOCATION_OPTIONS = [...new Set(MOCK_RESOURCES.map((r) => r.location))].sort();

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

    const [activeTab,       setActiveTab]       = useState('all');
    const [viewMode,        setViewMode]        = useState('grid');
    const [selectedResource, setSelectedResource] = useState(null);

    const { favourites, toggleFavourite } = useFavourites();

    const filters = useResourceFilters(MOCK_RESOURCES, favourites, activeTab);

    const {
        search, selectedType, selectedLocation, selectedCapacity,
        availableOnly, sortBy,
        setSearch, setSelectedType, setSelectedLocation, setSelectedCapacity,
        setAvailableOnly, setSortBy, setCurrentPage,
        filtered, paginated, totalPages, currentPage,
        hasActiveFilters, resetFilters, handleFilterChange,
    } = filters;

    const navigateToBook    = (r) => navigate(`/dashboard/bookings/new?resourceId=${r.id}`);
    const openDetails       = (r) => setSelectedResource(r);
    const closeDetails      = ()  => setSelectedResource(null);

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
            <div className="flex items-center gap-1 border-b border-gray-200 -mx-1 px-1">
                {TABS.map(({ key, label, icon: Icon }) => (
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
                        {key === 'favourites' && favourites.size > 0 && (
                            <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded-full">
                                {favourites.size}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Filter bar */}
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

            {/* Resource grid or list */}
            {paginated.length > 0 ? (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
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
                <EmptyState activeTab={activeTab} onBrowseAll={() => setActiveTab('all')} onClearFilters={resetFilters} />
            )}

            {/* Pagination */}
            <CataloguePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Resource detail drawer */}
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
const EmptyState = ({ activeTab, onBrowseAll, onClearFilters }) => (
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
                <p className="text-sm font-medium">No resources match your filters.</p>
                <button onClick={onClearFilters} className="text-xs underline hover:text-primary transition-colors">
                    Clear all filters
                </button>
            </>
        )}
    </div>
);


