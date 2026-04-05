import { Building2, Cpu, FlaskConical, Projector, DoorOpen, Wrench } from 'lucide-react';

/**
 * Maps a resource type string to its display icon and colour scheme.
 * Extend this map as new types are added in the backend.
 */
export const TYPE_CONFIG = {
    'Lecture Hall':  { icon: DoorOpen,      bg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
    'Computer Lab':  { icon: Cpu,           bg: 'bg-teal-50',   iconColor: 'text-teal-500'   },
    'Science Lab':   { icon: FlaskConical,  bg: 'bg-green-50',  iconColor: 'text-green-500'  },
    'Projector':     { icon: Projector,     bg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
    'Meeting Room':  { icon: Building2,     bg: 'bg-purple-50', iconColor: 'text-purple-500' },
    'Workshop':      { icon: Wrench,        bg: 'bg-orange-50', iconColor: 'text-orange-500' },
    'Smart Classroom':{ icon: DoorOpen,     bg: 'bg-blue-50',   iconColor: 'text-blue-500'   },
    'Design Studio': { icon: Wrench,        bg: 'bg-pink-50',   iconColor: 'text-pink-500'   },
    'Network Lab':   { icon: Cpu,           bg: 'bg-cyan-50',   iconColor: 'text-cyan-500'   },
    'Electronics Lab':{ icon: FlaskConical, bg: 'bg-amber-50',  iconColor: 'text-amber-500'  },
};

export const DEFAULT_TYPE_CONFIG = {
    icon: Building2,
    bg: 'bg-gray-50',
    iconColor: 'text-gray-500',
};

export const getTypeConfig = (type) => TYPE_CONFIG[type] ?? DEFAULT_TYPE_CONFIG;

/** Inline SVG chevron for custom select dropdowns (avoids Tailwind JIT purge issues). */
export const CHEVRON_BG = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.5rem center',
};

/** Capacity range options used by both FilterBar and useResourceFilters. */
export const CAPACITY_RANGES = [
    { value: '1-20',   label: '1 – 20'   },
    { value: '21-50',  label: '21 – 50'  },
    { value: '51-100', label: '51 – 100' },
    { value: '100+',   label: '100+'     },
];

/** Sort options used by both FilterBar and useResourceFilters. */
export const SORT_OPTIONS = [
    { value: 'default',        label: 'Sort: Default'          },
    { value: 'name-asc',       label: 'Name A → Z'            },
    { value: 'name-desc',      label: 'Name Z → A'            },
    { value: 'capacity-asc',   label: 'Capacity: Low → High'  },
    { value: 'capacity-desc',  label: 'Capacity: High → Low'  },
    { value: 'available-first',label: 'Available First'        },
];
