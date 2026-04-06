import React from 'react';
import { CalendarCheck, Info, MapPin, Users, Star } from 'lucide-react';
import { getTypeConfig } from '../constants/resourceTypeConfig';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const StatusBadge = ({ status }) => {
    const isActive = status === 'ACTIVE';
    return (
        <span
            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                isActive
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
            }`}
        >
            {isActive ? 'ACTIVE' : 'OUT OF SERVICE'}
        </span>
    );
};

const FavouriteButton = ({ isFavourite, onToggle, className = '' }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        className={`p-1.5 rounded-full transition-colors ${className}`}
    >
        <Star
            className={`w-4 h-4 transition-colors ${
                isFavourite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
            }`}
            strokeWidth={1.8}
        />
    </button>
);

// ---------------------------------------------------------------------------
// List row variant
// ---------------------------------------------------------------------------
const ListRow = ({ resource, isFavourite, onToggleFavourite, onViewDetails, onBook }) => {
    const { name, type, location, capacity, status } = resource;
    const { bg, iconColor, icon: Icon } = getTypeConfig(type);
    const isAvailable = status === 'ACTIVE';

    return (
        <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 px-3 sm:px-4 py-3">
            <div className={`${bg} shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${iconColor}`} strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-main truncate">{name}</p>
                <p className="text-xs text-text-muted hidden sm:block">
                    {type} &middot; {location} &middot; Capacity: {capacity}
                </p>
                <p className="text-xs text-text-muted sm:hidden">
                    {location} &middot; Cap: {capacity}
                </p>
            </div>

            <div className="hidden sm:block shrink-0">
                <StatusBadge status={status} />
            </div>

            <FavouriteButton
                isFavourite={isFavourite}
                onToggle={() => onToggleFavourite?.(resource.id)}
                className="shrink-0 hover:bg-gray-100"
            />

            {isAvailable ? (
                <button
                    onClick={() => onBook?.(resource)}
                    className="shrink-0 flex items-center gap-1 sm:gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
                >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Book Now</span>
                    <span className="xs:hidden">Book</span>
                </button>
            ) : (
                <button
                    onClick={() => onViewDetails?.(resource)}
                    className="shrink-0 flex items-center gap-1 sm:gap-1.5 text-xs font-semibold border border-gray-300 hover:border-primary hover:text-primary text-text-muted px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Info className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Details</span>
                </button>
            )}
        </article>
    );
};

// ---------------------------------------------------------------------------
// Grid card variant
// ---------------------------------------------------------------------------
const GridCard = ({ resource, isFavourite, onToggleFavourite, onViewDetails, onBook }) => {
    const { name, type, location, capacity, status } = resource;
    const { bg, iconColor, icon: Icon } = getTypeConfig(type);
    const isAvailable = status === 'ACTIVE';

    return (
        <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            {/* Banner */}
            <div className={`${bg} relative flex items-center justify-center h-32`}>
                <Icon className={`w-16 h-16 ${iconColor} opacity-80`} strokeWidth={1.2} />
                <FavouriteButton
                    isFavourite={isFavourite}
                    onToggle={() => onToggleFavourite?.(resource.id)}
                    className="absolute top-2 right-2 bg-white/70 hover:bg-white shadow-sm"
                />
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="text-sm font-bold text-text-main leading-tight">{name}</h3>

                <ul className="space-y-1 text-xs text-text-muted">
                    <li><span className="font-medium text-text-main">Type: </span>{type}</li>
                    <li className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {location}
                    </li>
                    <li className="flex items-center gap-1">
                        <Users className="w-3 h-3 shrink-0" /> Capacity: {capacity}
                    </li>
                </ul>

                <StatusBadge status={status} />

                <div className="mt-auto pt-1">
                    {isAvailable ? (
                        <button
                            onClick={() => onBook?.(resource)}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-1.5 rounded-lg transition-colors"
                        >
                            <CalendarCheck className="w-3.5 h-3.5" /> Book Now
                        </button>
                    ) : (
                        <button
                            onClick={() => onViewDetails?.(resource)}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-300 hover:border-primary hover:text-primary text-text-muted py-1.5 rounded-lg transition-colors"
                        >
                            <Info className="w-3.5 h-3.5" /> View Details
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

// ---------------------------------------------------------------------------
// Public component — delegates to grid or list variant
// ---------------------------------------------------------------------------
export const ResourceCard = ({ resource, isFavourite = false, onToggleFavourite, onViewDetails, onBook, listView = false }) => {
    const props = { resource, isFavourite, onToggleFavourite, onViewDetails, onBook };
    return listView ? <ListRow {...props} /> : <GridCard {...props} />;
};

