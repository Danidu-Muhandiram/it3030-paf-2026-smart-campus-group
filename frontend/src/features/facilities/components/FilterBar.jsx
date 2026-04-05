import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { CAPACITY_RANGES, SORT_OPTIONS, CHEVRON_BG } from '../constants/resourceTypeConfig';

/** Reusable styled select with a custom chevron and no browser default arrow. */
const FilterSelect = ({ value, onChange, children, ...rest }) => (
    <select
        value={value}
        onChange={onChange}
        className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main"
        style={CHEVRON_BG}
        {...rest}
    >
        {children}
    </select>
);

/**
 * Renders the full filter + sort + view-toggle bar for the Facilities Catalogue.
 * All state is lifted up — this component is purely presentational.
 */
export const FilterBar = ({
    // filter values
    search, selectedType, selectedLocation, selectedCapacity, availableOnly, sortBy,
    // setters via handleFilterChange wrapper
    onSearchChange, onTypeChange, onLocationChange, onCapacityChange,
    onAvailableOnlyChange, onSortChange,
    // view toggle
    viewMode, onViewModeChange,
    // meta
    resultCount, hasActiveFilters, onResetFilters,
    // option lists derived from data
    typeOptions, locationOptions,
}) => (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm">

        {/* Search */}
        <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
                type="text"
                placeholder="Search resources… (e.g. X502)"
                value={search}
                onChange={onSearchChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
        </div>

        {/* Type */}
        <FilterSelect value={selectedType} onChange={onTypeChange}>
            <option value="">All Types</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </FilterSelect>

        {/* Location */}
        <FilterSelect value={selectedLocation} onChange={onLocationChange}>
            <option value="">All Locations</option>
            {locationOptions.map((l) => <option key={l} value={l}>{l}</option>)}
        </FilterSelect>

        {/* Capacity */}
        <FilterSelect value={selectedCapacity} onChange={onCapacityChange}>
            <option value="">All Capacities</option>
            {CAPACITY_RANGES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </FilterSelect>

        {/* Available only */}
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none whitespace-nowrap">
            <input
                type="checkbox"
                checked={availableOnly}
                onChange={onAvailableOnlyChange}
                className="w-4 h-4 accent-primary rounded"
            />
            Available Only
        </label>

        {/* Clear filters */}
        {hasActiveFilters && (
            <button
                onClick={onResetFilters}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
            >
                <X className="w-3.5 h-3.5" />
                Clear
            </button>
        )}

        {/* Results count + Sort + View toggle */}
        <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-text-muted whitespace-nowrap">
                {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>

            <FilterSelect
                value={sortBy}
                onChange={onSortChange}
                className="text-xs border border-gray-200 rounded-lg pl-2 pr-7 py-1.5 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main"
                style={{ ...CHEVRON_BG, backgroundPosition: 'right 0.4rem center' }}
            >
                {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </FilterSelect>

            {/* Grid / List toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                {[
                    { mode: 'grid', Icon: LayoutGrid, title: 'Grid view'  },
                    { mode: 'list', Icon: List,        title: 'List view'  },
                ].map(({ mode, Icon, title }) => (
                    <button
                        key={mode}
                        onClick={() => onViewModeChange(mode)}
                        title={title}
                        className={`p-1.5 transition-colors ${
                            viewMode === mode
                                ? 'bg-primary text-white'
                                : 'bg-white text-text-muted hover:text-primary'
                        }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                    </button>
                ))}
            </div>
        </div>
    </div>
);
