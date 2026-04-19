import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Building2, CheckCircle2, Layers, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { deleteAsset, getAllAssets, getAllLocations, getAllResourceTypes } from '../../../services/resourceService';
import StatusBadge from '../components/StatusBadge';
import AssetModal from '../components/AssetModal';
import DeleteModal from '../components/DeleteModal';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const formatId = (id) => `RES-${String(id).padStart(2, '0')}`;

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, colorClass, sub }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-lg ${colorClass}`}>
                <Icon size={22} />
            </div>
            {sub && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-text-muted">
                    {sub}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-text-muted text-sm font-medium">{label}</h3>
            <p className="text-2xl font-bold text-text-main mt-1">{value}</p>
        </div>
    </div>
);

// ─── Per-type donut chart ────────────────────────────────────────────────────

const DONUT_COLORS = [
    '#1E3A8A', '#3B82F6', '#06B6D4', '#8B5CF6',
    '#F59E0B', '#10B981', '#EF4444', '#EC4899',
];

const TypeDonutChart = ({ assets, types }) => {
    const counts = useMemo(() => {
        const map = {};
        assets.forEach((a) => { if (a.type?.id) map[a.type.id] = (map[a.type.id] ?? 0) + 1; });
        return map;
    }, [assets]);

    const total = assets.length;
    if (!types.length || !total) return null;

    // Build arc paths for SVG donut
    const R = 56; // outer radius
    const r = 34; // inner radius
    const cx = 70; const cy = 70;
    const GAP = 0.03; // radians gap between slices

    let cumAngle = -Math.PI / 2;
    const slices = types
        .map((t) => ({ ...t, count: counts[t.id] ?? 0 }))
        .filter((t) => t.count > 0);

    const arcs = slices.map((t, i) => {
        const frac = t.count / total;
        const sweep = frac * 2 * Math.PI - GAP;
        const startAngle = cumAngle + GAP / 2;
        const endAngle = startAngle + sweep;
        cumAngle += frac * 2 * Math.PI;

        const x1 = cx + R * Math.cos(startAngle);
        const y1 = cy + R * Math.sin(startAngle);
        const x2 = cx + R * Math.cos(endAngle);
        const y2 = cy + R * Math.sin(endAngle);
        const ix1 = cx + r * Math.cos(endAngle);
        const iy1 = cy + r * Math.sin(endAngle);
        const ix2 = cx + r * Math.cos(startAngle);
        const iy2 = cy + r * Math.sin(startAngle);
        const large = sweep > Math.PI ? 1 : 0;

        return {
            key: t.id,
            name: t.name,
            count: t.count,
            pct: Math.round(frac * 100),
            color: DONUT_COLORS[i % DONUT_COLORS.length],
            d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${r} ${r} 0 ${large} 0 ${ix2} ${iy2} Z`,
        };
    });

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-4">
                Resources by Type
            </p>
            <div className="flex items-center gap-6">
                {/* Donut */}
                <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
                    {arcs.map((arc) => (
                        <path key={arc.key} d={arc.d} fill={arc.color}>
                            <title>{arc.name}: {arc.count} ({arc.pct}%)</title>
                        </path>
                    ))}
                    {/* Centre label */}
                    <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fill="#374151"
                        style={{ fontSize: 20, fontWeight: 700 }}>{total}</text>
                    <text x={cx} y={cy + 12} textAnchor="middle" fill="#9CA3AF"
                        style={{ fontSize: 10 }}>total</text>
                </svg>

                {/* Legend */}
                <ul className="flex-1 space-y-2 min-w-0">
                    {arcs.map((arc) => (
                        <li key={arc.key} className="flex items-center gap-1.5 text-xs min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: arc.color }} />
                            <span className="text-text-main shrink-0 max-w-[110px] truncate">{arc.name}</span>
                            <span
                                className="flex-1 border-b border-dotted border-gray-300 mx-1 mb-0.5"
                                aria-hidden="true"
                            />
                            <span className="text-text-main font-semibold shrink-0">{arc.count}</span>
                            <span className="text-gray-400 shrink-0">({arc.pct}%)</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ─── Resource Table Row ───────────────────────────────────────────────────────

const AssetRow = ({ asset, onEdit, onDelete }) => (
    <div className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-gray-50 last:border-b-0 items-start hover:bg-gray-50 transition-colors">
        <span className="col-span-1 text-xs font-mono font-semibold text-text-muted pt-0.5">
            {formatId(asset.id)}
        </span>
        <div className="col-span-2 flex items-center gap-1.5 min-w-0">
            <Building2 size={14} className="text-primary shrink-0" />
            <span className="text-sm font-medium text-text-main truncate">{asset.name}</span>
        </div>
        <span className="col-span-2 text-xs text-text-muted pt-0.5 line-clamp-2">
            {asset.description
                ? asset.description
                : <span className="italic opacity-40">—</span>}
        </span>
        <span className="col-span-1 text-sm text-text-muted truncate pt-0.5">
            {asset.type?.name ?? '—'}
        </span>
        <div className="col-span-2 flex items-center gap-1 min-w-0 pt-0.5">
            <MapPin size={13} className="text-text-muted shrink-0" />
            <span className="text-sm text-text-muted truncate">
                {asset.location
                    ? `${asset.location.name}${asset.location.buildingName ? ` · ${asset.location.buildingName}` : ''}`
                    : '—'}
            </span>
        </div>
        <span className="col-span-1 text-sm text-text-muted pt-0.5">{asset.capacity ?? '—'}</span>
        <span className="col-span-1 pt-0.5">
            <StatusBadge status={asset.status} />
        </span>
        <div className="col-span-2 flex items-center justify-end gap-1.5 pt-0.5">
            <button
                onClick={() => onEdit(asset)}
                className="p-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                title="Edit"
            >
                <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => onDelete(asset)}
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                title="Delete"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onChange }) => (
    <div className="flex items-center justify-center gap-1 pt-2">
        <button
            disabled={currentPage === 1}
            onClick={() => onChange(currentPage - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
            &lsaquo; Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => onChange(page)}
                className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                    currentPage === page
                        ? 'bg-primary text-white border-primary font-semibold'
                        : 'border-gray-200 text-text-muted hover:border-primary hover:text-primary'
                }`}
            >
                {page}
            </button>
        ))}
        <button
            disabled={currentPage === totalPages}
            onClick={() => onChange(currentPage + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
            Next &rsaquo;
        </button>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export const AdminResourcesPage = () => {
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // filters
    const [search, setSearch] = useState('');
    const [filterTypeId, setFilterTypeId] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterLocationId, setFilterLocationId] = useState('');
    const [filterCapMin, setFilterCapMin] = useState('');
    const [filterCapMax, setFilterCapMax] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // modal state: null | { mode: 'add' } | { mode: 'edit', asset }
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ── data loading ─────────────────────────────────────────────────────────

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const [a, l, t] = await Promise.all([
                getAllAssets(),
                getAllLocations(),
                getAllResourceTypes(),
            ]);
            setAssets(a);
            setLocations(l);
            setTypes(t);
        } catch {
            setFetchError('Failed to load resources. Please refresh.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── stats ─────────────────────────────────────────────────────────────────

    const stats = useMemo(() => ({
        total: assets.length,
        active: assets.filter((a) => a.status === 'ACTIVE').length,
        outOfService: assets.filter((a) => a.status === 'OUT_OF_SERVICE').length,
    }), [assets]);

    // ── filtering & pagination ───────────────────────────────────────────────

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        const capMin = filterCapMin !== '' ? Number(filterCapMin) : null;
        const capMax = filterCapMax !== '' ? Number(filterCapMax) : null;

        return assets.filter((a) => {
            if (filterTypeId && a.type?.id !== Number(filterTypeId)) return false;
            if (filterStatus && a.status !== filterStatus) return false;
            if (filterLocationId && a.location?.id !== Number(filterLocationId)) return false;
            if (capMin !== null && (a.capacity == null || a.capacity < capMin)) return false;
            if (capMax !== null && (a.capacity == null || a.capacity > capMax)) return false;
            if (
                q &&
                !a.name.toLowerCase().includes(q) &&
                !a.type?.name?.toLowerCase().includes(q) &&
                !a.location?.name?.toLowerCase().includes(q) &&
                !a.description?.toLowerCase().includes(q)
            ) return false;
            return true;
        });
    }, [assets, search, filterTypeId, filterStatus, filterLocationId, filterCapMin, filterCapMax]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const hasActiveFilters = search || filterTypeId || filterStatus || filterLocationId || filterCapMin || filterCapMax;

    const clearFilters = () => {
        setSearch('');
        setFilterTypeId('');
        setFilterStatus('');
        setFilterLocationId('');
        setFilterCapMin('');
        setFilterCapMax('');
        setCurrentPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    // ── CRUD callbacks ───────────────────────────────────────────────────────

    const handleSave = (saved, isEdit) => {
        setAssets((prev) =>
            isEdit ? prev.map((a) => (a.id === saved.id ? saved : a)) : [...prev, saved]
        );
        setModal(null);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await deleteAsset(deleteTarget.id);
            setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch {
            // keep modal open so user can retry
        } finally {
            setDeleting(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────

    const selectCls = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20';

    return (
        <div className="space-y-6 pb-10">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Resource Management Dashboard</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Manage halls, labs, and shared campus assets.
                    </p>
                </div>
                <button
                    onClick={() => setModal({ mode: 'add' })}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add New Resource
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    label="Total Resources"
                    value={stats.total}
                    icon={Layers}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    label="Active"
                    value={stats.active}
                    icon={CheckCircle2}
                    colorClass="bg-green-50 text-green-600"
                    sub={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of total`}
                />
                <StatCard
                    label="Out of Service"
                    value={stats.outOfService}
                    icon={AlertTriangle}
                    colorClass="bg-red-50 text-red-500"
                    sub={`${stats.total ? Math.round((stats.outOfService / stats.total) * 100) : 0}% of total`}
                />
            </div>

            {/* Resources by type donut */}
            <TypeDonutChart assets={assets} types={types} />



            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-wrap gap-3 items-end">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        <input
                            value={search}
                            onChange={handleFilterChange(setSearch)}
                            placeholder="Search name, type, location…"
                            className="pl-9 pr-3 py-2 w-full text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Type */}
                    <select value={filterTypeId} onChange={handleFilterChange(setFilterTypeId)} className={selectCls}>
                        <option value="">All Types</option>
                        {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    {/* Status */}
                    <select value={filterStatus} onChange={handleFilterChange(setFilterStatus)} className={selectCls}>
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>

                    {/* Location */}
                    <select value={filterLocationId} onChange={handleFilterChange(setFilterLocationId)} className={selectCls}>
                        <option value="">All Locations</option>
                        {locations.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}{l.buildingName ? ` · ${l.buildingName}` : ''}
                            </option>
                        ))}
                    </select>

                    {/* Capacity range */}
                    <div className="flex items-center gap-1.5">
                        <input
                            type="number"
                            min="0"
                            value={filterCapMin}
                            onChange={handleFilterChange(setFilterCapMin)}
                            placeholder="Cap min"
                            className="w-24 text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-text-muted text-sm">–</span>
                        <input
                            type="number"
                            min="0"
                            value={filterCapMax}
                            onChange={handleFilterChange(setFilterCapMax)}
                            placeholder="Cap max"
                            className="w-24 text-sm border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-2"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {hasActiveFilters && (
                    <p className="mt-2 text-xs text-text-muted">
                        Showing <span className="font-semibold text-text-main">{filtered.length}</span> of {assets.length} resources
                    </p>
                )}
            </div>

            {fetchError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {fetchError}
                </div>
            )}

            {/* Table */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <span className="col-span-1">ID</span>
                    <span className="col-span-2">Name</span>
                    <span className="col-span-2">Description</span>
                    <span className="col-span-1">Type</span>
                    <span className="col-span-2">Location</span>
                    <span className="col-span-1">Cap/Qty</span>
                    <span className="col-span-1">Status</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-gray-50 animate-pulse">
                            {[1, 2, 2, 1, 2, 1, 1, 2].map((span, j) => (
                                <div key={j} className={`col-span-${span} h-4 bg-gray-100 rounded`} />
                            ))}
                        </div>
                    ))
                ) : paginated.length === 0 ? (
                    <div className="py-16 text-center text-sm text-text-muted">
                        No resources found.
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-primary underline ml-1">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    paginated.map((asset) => (
                        <AssetRow
                            key={asset.id}
                            asset={asset}
                            onEdit={(a) => setModal({ mode: 'edit', asset: a })}
                            onDelete={setDeleteTarget}
                        />
                    ))
                )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
            )}

            {/* Add / Edit modal */}
            {modal && (
                <AssetModal
                    asset={modal.mode === 'edit' ? modal.asset : null}
                    locations={locations}
                    types={types}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                    onTypesChange={setTypes}
                />
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <DeleteModal
                    asset={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
        </div>
    );
};
