import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { CAPACITY_RANGES, SORT_OPTIONS, CHEVRON_BG } from '../constants/resourceTypeConfig';

/** Reusable styled select with a custom chevron and no browser default arrow. */
const FilterSelect = ({ value, onChange, children, className = '', style = {}, ...rest }) => (
    <select
        value={value}
        onChange={onChange}
        className={`text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main w-full ${className}`}
        style={{ ...CHEVRON_BG, ...style }}
        {...rest}
    >
        {children}
    </select>
);

/**
 * Renders the full filter + sort + view-toggle bar for the Facilities Catalogue.
 * All state is lifted up — this component is purely presentational.
 * Fully responsive: stacks vertically on mobile, wraps on tablet+.
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
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">

        {/* Row 1 — Search (full width) */}
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
                type="text"
                placeholder="Search by name, type or location…"
                value={search}
                onChange={onSearchChange}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 placeholder:text-gray-400"
            />
        </div>

        {/* Row 2 — Dropdown filters grid (2 cols on mobile, 4 on md+) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <FilterSelect value={selectedType} onChange={onTypeChange}>
                <option value="">All Types</option>
                {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </FilterSelect>

            <FilterSelect value={selectedLocation} onChange={onLocationChange}>
                <option value="">All Locations</option>
                {locationOptions.map((l) => <option key={l} value={l}>{l}</option>)}
            </FilterSelect>

            <FilterSelect value={selectedCapacity} onChange={onCapacityChange}>
                <option value="">All Capacities</option>
                {CAPACITY_RANGES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </FilterSelect>

            {/* Available-only checkbox styled as a pill */}
            <label className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer select-none border border-gray-200 rounded-xl px-3 py-2 transition-colors hover:border-primary hover:text-primary"
                style={{ color: availableOnly ? 'var(--color-primary)' : undefined, borderColor: availableOnly ? 'var(--color-primary)' : undefined }}
            >
                <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={onAvailableOnlyChange}
                    className="w-4 h-4 accent-primary rounded shrink-0"
                />
                <span className="whitespace-nowrap">Available Only</span>
            </label>
        </div>

        {/* Row 3 — Meta: results count, sort, view toggle, clear */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">

            <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs text-text-muted">
                    <span className="font-semibold text-text-main">{resultCount}</span> result{resultCount !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={onResetFilters}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                        <X className="w-3 h-3" />
                        Clear all
                    </button>
                )}

                {/* Sort */}
                <FilterSelect
                    value={sortBy}
                    onChange={onSortChange}
                    className="!w-auto text-xs pl-2 pr-7 py-1.5"
                    style={{ backgroundPosition: 'right 0.4rem center' }}
                >
                    {SORT_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </FilterSelect>

                {/* Grid / List toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    {[
                        { mode: 'grid', Icon: LayoutGrid, title: 'Grid view' },
                        { mode: 'list', Icon: List,        title: 'List view' },
                    ].map(({ mode, Icon, title }) => (
                        <button
                            key={mode}
                            onClick={() => onViewModeChange(mode)}
                            title={title}
                            className={`p-2 transition-colors ${
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
    </div>
);
