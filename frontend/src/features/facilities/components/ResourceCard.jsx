import React from 'react';
import {
    Building2,
    Cpu,
    FlaskConical,
    Projector,
    DoorOpen,
    Wrench,
    CalendarCheck,
    Info,
    MapPin,
    Users,
    Star,
} from 'lucide-react';

const TYPE_CONFIG = {
    'Lecture Hall': {
        icon: DoorOpen,
        bg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    'Computer Lab': {
        icon: Cpu,
        bg: 'bg-teal-50',
        iconColor: 'text-teal-500',
    },
    'Science Lab': {
        icon: FlaskConical,
        bg: 'bg-green-50',
        iconColor: 'text-green-500',
    },
    'Projector': {
        icon: Projector,
        bg: 'bg-yellow-50',
        iconColor: 'text-yellow-500',
    },
    'Meeting Room': {
        icon: Building2,
        bg: 'bg-purple-50',
        iconColor: 'text-purple-500',
    },
    'Workshop': {
        icon: Wrench,
        bg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
};

const DEFAULT_CONFIG = {
    icon: Building2,
    bg: 'bg-gray-50',
    iconColor: 'text-gray-500',
};

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
            {isActive ? 'ACTIVE' : 'OUT_OF_SERVICE'}
        </span>
    );
};

export const ResourceCard = ({ resource, isFavourite = false, onToggleFavourite, onViewDetails, onBook }) => {
    const { name, type, location, capacity, status } = resource;
    const config = TYPE_CONFIG[type] || DEFAULT_CONFIG;
    const Icon = config.icon;
    const isAvailable = status === 'ACTIVE';

    return (
        <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            {/* Resource Icon Banner */}
            <div className={`${config.bg} relative flex items-center justify-center h-32`}>
                <Icon className={`w-16 h-16 ${config.iconColor} opacity-80`} strokeWidth={1.2} />
                {/* Favourite button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavourite?.(resource.id); }}
                    title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors shadow-sm"
                >
                    <Star
                        className={`w-4 h-4 transition-colors ${
                            isFavourite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                        }`}
                        strokeWidth={1.8}
                    />
                </button>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                {/* Name */}
                <h3 className="text-sm font-bold text-text-main leading-tight">{name}</h3>

                {/* Details */}
                <ul className="space-y-1 text-xs text-text-muted">
                    <li>
                        <span className="font-medium text-text-main">Type: </span>
                        {type}
                    </li>
                    <li className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        Location: {location}
                    </li>
                    <li className="flex items-center gap-1">
                        <Users className="w-3 h-3 shrink-0" />
                        Capacity: {capacity}
                    </li>
                </ul>

                {/* Status Badge */}
                <StatusBadge status={status} />

                {/* Action Buttons */}
                <div className="mt-auto pt-1 flex gap-2">
                    {isAvailable ? (
                        <button
                            onClick={() => onBook?.(resource)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-1.5 rounded-lg transition-colors"
                        >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            Book Now
                        </button>
                    ) : (
                        <button
                            onClick={() => onViewDetails?.(resource)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-300 hover:border-primary hover:text-primary text-text-muted py-1.5 rounded-lg transition-colors"
                        >
                            <Info className="w-3.5 h-3.5" />
                            View Details
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};
