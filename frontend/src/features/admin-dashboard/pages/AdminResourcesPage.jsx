import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { deleteAsset, getAllAssets, getAllLocations, getAllResourceTypes } from '../../../services/resourceService';
import StatusBadge from '../components/StatusBadge';
import AssetModal from '../components/AssetModal';
import DeleteModal from '../components/DeleteModal';

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PAGE_SIZE = 8;

const formatId = (id) => `RES-${String(id).padStart(2, '0')}`;

// â”€â”€â”€ Resource Table Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const AssetRow = ({ asset, onEdit, onDelete }) => (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 items-center hover:bg-gray-50 transition-colors">
        <span className="col-span-1 text-xs font-mono font-semibold text-text-muted">
            {formatId(asset.id)}
        </span>
        <div className="col-span-3 flex items-center gap-2 min-w-0">
            <Building2 size={15} className="text-primary shrink-0" />
            <span className="text-sm font-medium text-text-main truncate">{asset.name}</span>
        </div>
        <span className="col-span-2 text-sm text-text-muted truncate">
            {asset.type?.name ?? 'â€”'}
        </span>
        <div className="col-span-2 flex items-center gap-1 min-w-0">
            <MapPin size={13} className="text-text-muted shrink-0" />
            <span className="text-sm text-text-muted truncate">
                {asset.location
                    ? `${asset.location.name}${asset.location.buildingName ? ` Â· ${asset.location.buildingName}` : ''}`
                    : 'â€”'}
            </span>
        </div>
        <span className="col-span-1 text-sm text-text-muted">{asset.capacity ?? 'â€”'}</span>
        <span className="col-span-2">
            <StatusBadge status={asset.status} />
        </span>
        <div className="col-span-1 flex items-center justify-end gap-1.5">
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

// â”€â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const AdminResourcesPage = () => {
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [search, setSearch] = useState('');
    const [filterTypeId, setFilterTypeId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // modal state: null | { mode: 'add' } | { mode: 'edit', asset }
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // â”€â”€ data loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    // â”€â”€ filtering & pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return assets.filter((a) => {
            if (filterTypeId && a.type?.id !== Number(filterTypeId)) return false;
            if (
                q &&
                !a.name.toLowerCase().includes(q) &&
                !a.type?.name?.toLowerCase().includes(q) &&
                !a.location?.name?.toLowerCase().includes(q)
            ) return false;
            return true;
        });
    }, [assets, search, filterTypeId]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    // â”€â”€ CRUD callbacks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    // â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    return (
        <div className="space-y-6 pb-10">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main">Resource Management Dashboard</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Manage rooms, labs, and shared campus assets.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                    onClick={() => setModal({ mode: 'add' })}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New Resource
                </button>

                <div className="flex-1" />

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        value={search}
                        onChange={handleFilterChange(setSearch)}
                        placeholder="Searchâ€¦"
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
                    />
                </div>

                {/* Type filter */}
                <select
                    value={filterTypeId}
                    onChange={handleFilterChange(setFilterTypeId)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">All Types</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {fetchError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {fetchError}
                </div>
            )}

            {/* Table */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <span className="col-span-1">ID</span>
                    <span className="col-span-3">Name</span>
                    <span className="col-span-2">Type</span>
                    <span className="col-span-2">Location</span>
                    <span className="col-span-1">Cap / Qty</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-1 text-right">Actions</span>
                </div>

                {loading ? (
                    // Skeleton rows
                    Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 animate-pulse"
                        >
                            {[1, 3, 2, 2, 1, 2, 1].map((span, j) => (
                                <div key={j} className={`col-span-${span} h-4 bg-gray-100 rounded`} />
                            ))}
                        </div>
                    ))
                ) : paginated.length === 0 ? (
                    <div className="py-16 text-center text-sm text-text-muted">
                        No resources found.
                        {(search || filterTypeId) && (
                            <button
                                onClick={() => { setSearch(''); setFilterTypeId(''); }}
                                className="text-primary underline ml-1"
                            >
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                />
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

