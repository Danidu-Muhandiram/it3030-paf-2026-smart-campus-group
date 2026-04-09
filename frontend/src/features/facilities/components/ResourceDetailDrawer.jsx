import React, { useEffect, useState } from 'react';
import {
    X, Minus, Maximize2, CalendarCheck, MapPin, Users,
    Tag, Activity, ChevronLeft, ChevronRight, Clock,
    CheckCircle2, XCircle, Star,
} from 'lucide-react';
import { getTypeConfig } from '../constants/resourceTypeConfig';

// ---------------------------------------------------------------------------
// Mini availability calendar — self-contained, consistent with design system
// ---------------------------------------------------------------------------

/** Generate weeks for a given month (Date object). Returns array of 7-item arrays. */
function buildCalendarWeeks(year, month) {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

const WEEK_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Mock time-slots — replace with API data when backend is wired. */
const MOCK_SLOTS = [
    { start: '08:00', end: '09:30', booked: false },
    { start: '09:30', end: '11:00', booked: true,  bookedBy: 'Dr. A. Silva'  },
    { start: '11:00', end: '12:30', booked: false },
    { start: '13:00', end: '14:30', booked: true,  bookedBy: 'Ms. R. Perera' },
    { start: '14:30', end: '16:00', booked: false },
    { start: '16:00', end: '17:30', booked: false },
];

const fmt = (d) =>
    d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const isoDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const MiniCalendar = ({ selectedDate, onDateSelect }) => {
    const today = new Date();
    const [cursor, setCursor] = useState(
        selectedDate ? new Date(selectedDate) : today,
    );
    const year  = cursor.getFullYear();
    const month = cursor.getMonth();
    const weeks = buildCalendarWeeks(year, month);

    return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            {/* Month nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCursor(new Date(year, month - 1, 1))}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-text-muted" />
                </button>
                <span className="text-xs font-semibold text-text-main">{fmt(cursor)}</span>
                <button
                    onClick={() => setCursor(new Date(year, month + 1, 1))}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5">
                {WEEK_LABELS.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-text-muted py-0.5">
                        {d}
                    </div>
                ))}
                {weeks.map((week, wi) =>
                    week.map((day, di) => {
                        if (!day) return <div key={`e-${wi}-${di}`} />;
                        const iso   = isoDate(year, month, day);
                        const isToday   = iso === isoDate(today.getFullYear(), today.getMonth(), today.getDate());
                        const isSelected = iso === selectedDate;
                        const isPast    = new Date(iso) < new Date(isoDate(today.getFullYear(), today.getMonth(), today.getDate()));
                        return (
                            <button
                                key={iso}
                                disabled={isPast}
                                onClick={() => onDateSelect(iso)}
                                className={`text-[11px] font-medium rounded-md py-1 transition-colors
                                    ${isSelected ? 'bg-primary text-white' :
                                      isToday    ? 'border border-primary text-primary' :
                                      isPast     ? 'text-gray-300 cursor-not-allowed' :
                                                   'hover:bg-primary/10 text-text-main'}`}
                            >
                                {day}
                            </button>
                        );
                    }),
                )}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Time slots panel
// ---------------------------------------------------------------------------
const TimeSlots = ({ date }) => {
    // TODO: replace with real API call: resourceService.getSlots(resourceId, date)
    const slots = MOCK_SLOTS;
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Time Slots — {date ?? 'Select a date'}
            </p>
            {slots.map((s) => (
                <div
                    key={s.start}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 border text-xs
                        ${s.booked
                            ? 'bg-red-50 border-red-100 text-red-700'
                            : 'bg-green-50 border-green-100 text-green-700'}`}
                >
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="font-semibold">{s.start} – {s.end}</span>
                        {s.booked && s.bookedBy && (
                            <span className="text-red-500 text-[10px] truncate max-w-28">· {s.bookedBy}</span>
                        )}
                    </div>
                    {s.booked
                        ? <XCircle className="w-3.5 h-3.5 shrink-0" />
                        : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </div>
            ))}
        </div>
    );
};

// ---------------------------------------------------------------------------
// Specification row
// ---------------------------------------------------------------------------
const SpecRow = ({ icon: Icon, label, value, valueClass = '' }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide leading-none mb-0.5">
                {label}
            </p>
            <p className={`text-sm font-medium text-text-main truncate ${valueClass}`}>{value}</p>
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Main drawer
// ---------------------------------------------------------------------------

/**
 * ResourceDetailDrawer
 * Props:
 *   resource       — resource object or null
 *   isFavourite    — boolean
 *   onToggleFavourite(id)
 *   onBook(resource)
 *   onClose()
 */
export const ResourceDetailDrawer = ({
    resource,
    isFavourite = false,
    onToggleFavourite,
    onBook,
    onClose,
}) => {
    const [minimised,    setMinimised]    = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Reset minimised state each time resource changes
    useEffect(() => {
        setMinimised(false);
        setSelectedDate(null);
    }, [resource?.id]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const isOpen = !!resource;

    if (!isOpen) return null;

    const { bg, iconColor, icon: Icon } = getTypeConfig(resource.type);
    const isActive = resource.status === 'ACTIVE';

    return (
        <>
            {/* Scrim — clicking it closes the drawer */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <aside
                className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl border-l border-gray-100
                    transition-all duration-300 ease-in-out
                    ${minimised ? 'w-14' : 'w-full sm:w-96 lg:w-[420px]'}`}
                role="dialog"
                aria-modal="true"
                aria-label={`Details for ${resource.name}`}
            >
                {/* ── Minimised strip ── */}
                {minimised ? (
                    <div className="flex flex-col items-center py-4 gap-3 h-full">
                        <button
                            onClick={() => setMinimised(false)}
                            title="Expand panel"
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Maximize2 className="w-4 h-4 text-text-muted" />
                        </button>
                        <div
                            className="writing-mode-vertical flex-1 flex items-center justify-center"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                            <span className="text-xs font-semibold text-text-muted rotate-180 truncate max-h-48 select-none">
                                {resource.name}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            title="Close"
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4 text-text-muted" />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ── Header banner ── */}
                        <div className={`${bg} relative shrink-0 flex items-center justify-center h-36`}>
                            <Icon className={`w-20 h-20 ${iconColor} opacity-75`} strokeWidth={1} />

                            {/* Favourite button */}
                            <button
                                onClick={() => onToggleFavourite?.(resource.id)}
                                title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                                className="absolute top-3 left-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                            >
                                <Star
                                    className={`w-4 h-4 ${isFavourite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                                    strokeWidth={1.8}
                                />
                            </button>

                            {/* Window controls */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                <button
                                    onClick={() => setMinimised(true)}
                                    title="Minimise panel"
                                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                                >
                                    <Minus className="w-3.5 h-3.5 text-text-muted" />
                                </button>
                                <button
                                    onClick={onClose}
                                    title="Close panel"
                                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-text-muted" />
                                </button>
                            </div>

                            {/* Status badge overlay */}
                            <span
                                className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border
                                    ${isActive
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-red-100 text-red-700 border-red-200'}`}
                            >
                                {isActive ? 'ACTIVE' : 'OUT OF SERVICE'}
                            </span>
                        </div>

                        {/* ── Scrollable body ── */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-5 space-y-6">

                                {/* Title */}
                                <div>
                                    <h2 className="text-lg font-bold text-text-main leading-tight">
                                        {resource.name}
                                    </h2>
                                    <p className="text-xs text-text-muted mt-0.5">{resource.type}</p>
                                </div>

                                {/* Specs */}
                                <section>
                                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">
                                        Specifications
                                    </p>
                                    <div className="bg-white border border-gray-100 rounded-xl px-4 divide-y divide-gray-50">
                                        <SpecRow icon={Tag}      label="Type"     value={resource.type}     />
                                        <SpecRow icon={MapPin}   label="Location" value={resource.location} />
                                        <SpecRow icon={Users}    label="Capacity" value={`${resource.capacity} ${resource.capacity === 1 ? 'person' : 'people'}`} />
                                        <SpecRow
                                            icon={Activity}
                                            label="Status"
                                            value={isActive ? 'Available' : 'Out of Service'}
                                            valueClass={isActive ? 'text-green-600' : 'text-red-500'}
                                        />
                                    </div>
                                </section>

                                {/* Availability calendar */}
                                <section className="space-y-3">
                                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                                        Availability
                                    </p>
                                    <MiniCalendar
                                        selectedDate={selectedDate}
                                        onDateSelect={setSelectedDate}
                                    />
                                    {selectedDate && <TimeSlots date={selectedDate} />}
                                </section>
                            </div>
                        </div>

                        {/* ── Sticky footer CTA ── */}
                        <div className="shrink-0 p-4 border-t border-gray-100 bg-white space-y-2">
                            {isActive ? (
                                <button
                                    onClick={() => onBook?.(resource)}
                                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl transition-colors"
                                >
                                    <CalendarCheck className="w-4 h-4" />
                                    Book This Resource
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 text-text-muted py-2.5 rounded-xl cursor-not-allowed bg-gray-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Unavailable for Booking
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full text-xs text-text-muted hover:text-text-main transition-colors py-1"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
};
