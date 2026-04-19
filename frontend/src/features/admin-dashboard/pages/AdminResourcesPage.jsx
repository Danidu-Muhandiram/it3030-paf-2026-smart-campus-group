import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Building2, ChevronDown, ImagePlus, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import {
    createAsset,
    createLocation,
    createResourceType,
    deleteAsset,
    getAllAssets,
    getAllLocations,
    getAllResourceTypes,
    updateAsset,
    updateLocation,
    updateResourceType,
    uploadImage,
} from '../../../services/resourceService';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

const STATUS_STYLES = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    OUT_OF_SERVICE: 'bg-red-100 text-red-700 border-red-200',
};

const PAGE_SIZE = 8;

const EMPTY_ASSET = { name: '', typeId: '', status: 'ACTIVE', capacity: '', locationId: '', imageUrl: '' };
const EMPTY_LOCATION = { name: '', buildingName: '', floorNo: '' };
const EMPTY_TYPE = { name: '' };

// ─── Small reusable pieces ────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status?.replace('_', ' ')}
    </span>
);

const InputField = ({ label, required, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-text-main mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

// ─── Location picker with inline add/edit ─────────────────────────────────────

const LocationPickerField = ({ value, onChange, locations, onLocationsChange, error }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_LOCATION);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = locations.find((l) => l.id === value);

    const openNew = () => { setShowDropdown(false); setEditing('new'); setForm(EMPTY_LOCATION); setFormError(''); };
    const openEdit = (loc, e) => {
        e.stopPropagation();
        setEditing(loc);
        setForm({ name: loc.name, buildingName: loc.buildingName ?? '', floorNo: loc.floorNo ?? '' });
        setFormError('');
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setFormError('Name is required'); return; }
        setSaving(true);
        try {
            const payload = { name: form.name.trim(), buildingName: form.buildingName || null, floorNo: form.floorNo ? Number(form.floorNo) : null };
            let updated;
            if (editing === 'new') {
                updated = await createLocation(payload);
                onLocationsChange([...locations, updated]);
                onChange(updated.id);
            } else {
                updated = await updateLocation(editing.id, payload);
                onLocationsChange(locations.map((l) => l.id === updated.id ? updated : l));
                if (value === editing.id) onChange(updated.id);
            }
            setEditing(null);
        } catch {
            setFormError('Failed to save location');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setShowDropdown((v) => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left transition-colors ${error ? 'border-red-400' : 'border-gray-200 hover:border-primary'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
            >
                <span className={selected ? 'text-text-main' : 'text-text-muted'}>
                    {selected ? `${selected.name}${selected.buildingName ? ` · ${selected.buildingName}` : ''}` : 'Select location…'}
                </span>
                <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
            </button>

            {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                        {locations.length === 0 && (
                            <li className="px-3 py-2 text-sm text-text-muted">No locations yet</li>
                        )}
                        {locations.map((loc) => (
                            <li
                                key={loc.id}
                                onClick={() => { onChange(loc.id); setShowDropdown(false); }}
                                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${value === loc.id ? 'bg-blue-50 text-primary font-medium' : 'text-text-main'}`}
                            >
                                <span>
                                    {loc.name}
                                    {loc.buildingName && <span className="ml-1 text-text-muted font-normal"> · {loc.buildingName}</span>}
                                    {loc.floorNo != null && <span className="ml-1 text-text-muted font-normal"> · Floor {loc.floorNo}</span>}
                                </span>
                                <button type="button" onClick={(e) => openEdit(loc, e)} className="ml-2 p-0.5 text-text-muted hover:text-primary">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={openNew}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-blue-50 border-t border-gray-100"
                    >
                        <Plus className="w-4 h-4" /> Add New Location
                    </button>
                </div>
            )}

            {editing && (
                <div className="mt-2 p-3 border border-primary/30 rounded-xl bg-blue-50 space-y-2">
                    <p className="text-xs font-semibold text-primary">{editing === 'new' ? 'New Location' : 'Edit Location'}</p>
                    <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Building" value={form.buildingName} onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
                            className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <input placeholder="Floor No" type="number" value={form.floorNo} onChange={(e) => setForm({ ...form, floorNo: e.target.value })}
                            className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSave} disabled={saving}
                            className="flex-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setEditing(null)}
                            className="flex-1 text-xs font-semibold border border-gray-200 text-text-muted hover:border-primary hover:text-primary py-1.5 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

// ─── Type picker with inline add/edit ────────────────────────────────────────

const TypePickerField = ({ value, onChange, types, onTypesChange, error }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_TYPE);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = types.find((t) => t.id === value);

    const openNew = () => { setShowDropdown(false); setEditing('new'); setForm(EMPTY_TYPE); setFormError(''); };
    const openEdit = (type, e) => {
        e.stopPropagation();
        setEditing(type);
        setForm({ name: type.name });
        setFormError('');
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setFormError('Name is required'); return; }
        setSaving(true);
        try {
            const payload = { name: form.name.trim() };
            let updated;
            if (editing === 'new') {
                updated = await createResourceType(payload);
                onTypesChange([...types, updated]);
                onChange(updated.id);
            } else {
                updated = await updateResourceType(editing.id, payload);
                onTypesChange(types.map((t) => t.id === updated.id ? updated : t));
                if (value === editing.id) onChange(updated.id);
            }
            setEditing(null);
        } catch {
            setFormError('Failed to save type');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setShowDropdown((v) => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left transition-colors ${error ? 'border-red-400' : 'border-gray-200 hover:border-primary'} focus:outline-none focus:ring-2 focus:ring-primary/20`}
            >
                <span className={selected ? 'text-text-main' : 'text-text-muted'}>
                    {selected ? selected.name : 'Select type…'}
                </span>
                <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
            </button>

            {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                        {types.length === 0 && (
                            <li className="px-3 py-2 text-sm text-text-muted">No types yet</li>
                        )}
                        {types.map((type) => (
                            <li
                                key={type.id}
                                onClick={() => { onChange(type.id); setShowDropdown(false); }}
                                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${value === type.id ? 'bg-blue-50 text-primary font-medium' : 'text-text-main'}`}
                            >
                                <span>{type.name}</span>
                                <button type="button" onClick={(e) => openEdit(type, e)} className="ml-2 p-0.5 text-text-muted hover:text-primary">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={openNew}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-blue-50 border-t border-gray-100"
                    >
                        <Plus className="w-4 h-4" /> Add New Type
                    </button>
                </div>
            )}

            {editing && (
                <div className="mt-2 p-3 border border-primary/30 rounded-xl bg-blue-50 space-y-2">
                    <p className="text-xs font-semibold text-primary">{editing === 'new' ? 'New Type' : 'Edit Type'}</p>
                    <input placeholder="Type name *" value={form.name} onChange={(e) => setForm({ name: e.target.value })}
                        className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSave} disabled={saving}
                            className="flex-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setEditing(null)}
                            className="flex-1 text-xs font-semibold border border-gray-200 text-text-muted hover:border-primary hover:text-primary py-1.5 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

// ─── Asset Modal ──────────────────────────────────────────────────────────────

const AssetModal = ({ asset, locations, types, onSave, onClose, onTypesChange }) => {
    const isEdit = !!asset?.id;
    const [form, setForm] = useState(isEdit ? {
        name: asset.name,
        typeId: asset.type?.id ?? '',
        status: asset.status,
        capacity: asset.capacity ?? '',
        locationId: asset.location?.id ?? '',
        imageUrl: asset.imageUrl ?? '',
    } : EMPTY_ASSET);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [locs, setLocs] = useState(locations);
    const [localTypes, setLocalTypes] = useState(types);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(isEdit ? asset.imageUrl ?? '' : '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));
    const setE = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview('');
        setForm((f) => ({ ...f, imageUrl: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.typeId) e.typeId = 'Type is required';
        if (!form.status) e.status = 'Status is required';
        if (!form.capacity || Number(form.capacity) <= 0) e.capacity = 'Capacity must be greater than 0';
        if (!form.locationId) e.locationId = 'Location is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        try {
            // Upload new image first if one was selected
            let finalImageUrl = form.imageUrl;
            if (imageFile) {
                setUploading(true);
                finalImageUrl = await uploadImage(imageFile);
                setUploading(false);
            }
            const payload = { ...form, capacity: Number(form.capacity), locationId: Number(form.locationId), typeId: Number(form.typeId), imageUrl: finalImageUrl };
            const saved = isEdit ? await updateAsset(asset.id, payload) : await createAsset(payload);
            onTypesChange(localTypes);
            onSave(saved, isEdit);
        } catch (err) {
            setUploading(false);
            setErrors({ _global: err?.response?.data?.message ?? 'Failed to save. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-text-main">{isEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-text-muted">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors._global && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors._global}</div>
                    )}

                    <InputField label="Resource Name" required error={errors.name}>
                        <input
                            value={form.name}
                            onChange={setE('name')}
                            placeholder="e.g. B401 Computing Lab"
                            className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-400' : 'border-gray-200 hover:border-primary'}`}
                        />
                    </InputField>

                    <InputField label="Type" required error={null}>
                        <TypePickerField
                            value={form.typeId}
                            onChange={set('typeId')}
                            types={localTypes}
                            onTypesChange={setLocalTypes}
                            error={errors.typeId}
                        />
                    </InputField>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Capacity/Quantity" required error={errors.capacity}>
                            <input
                                type="number"
                                min="1"
                                value={form.capacity}
                                onChange={setE('capacity')}
                                placeholder="e.g. 50"
                                className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.capacity ? 'border-red-400' : 'border-gray-200 hover:border-primary'}`}
                            />
                        </InputField>

                        <InputField label="Status" required error={errors.status}>
                            <select
                                value={form.status}
                                onChange={setE('status')}
                                className={`w-full text-sm px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.status ? 'border-red-400' : 'border-gray-200 hover:border-primary'}`}
                            >
                                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </InputField>
                    </div>

                    <InputField label="Location" required error={null}>
                        <LocationPickerField
                            value={form.locationId}
                            onChange={set('locationId')}
                            locations={locs}
                            onLocationsChange={setLocs}
                            error={errors.locationId}
                        />
                    </InputField>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">Resource Image <span className="text-text-muted font-normal">(optional)</span></label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageChange}
                            className="hidden"
                            id="resource-image-input"
                        />
                        {imagePreview ? (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
                                <img
                                    src={imagePreview.startsWith('blob:') ? imagePreview : `http://localhost:8085${imagePreview}`}
                                    alt="Resource preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <label htmlFor="resource-image-input"
                                        className="cursor-pointer text-xs font-semibold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-lg">
                                        Change
                                    </label>
                                    <button type="button" onClick={clearImage}
                                        className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="resource-image-input"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors">
                                <ImagePlus className="w-8 h-8 text-text-muted mb-2" />
                                <span className="text-sm text-text-muted">Click to upload image</span>
                                <span className="text-xs text-text-muted mt-0.5">JPEG, PNG, WebP or GIF · max 5 MB</span>
                            </label>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-gray-200 text-text-muted hover:border-primary hover:text-primary text-sm font-semibold py-2.5 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving || uploading}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                            {uploading ? 'Uploading image…' : saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ asset, onConfirm, onClose, deleting }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-text-main">Delete Resource</h2>
            </div>
            <p className="text-sm text-text-muted">
                Are you sure you want to delete <span className="font-semibold text-text-main">"{asset.name}"</span>?
                This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button onClick={onClose}
                    className="flex-1 border border-gray-200 text-text-muted hover:border-primary hover:text-primary text-sm font-semibold py-2.5 rounded-xl">
                    Cancel
                </button>
                <button onClick={onConfirm} disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">
                    {deleting ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export const AdminResourcesPage = () => {
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [search, setSearch] = useState('');
    const [filterTypeId, setFilterTypeId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const [a, l, t] = await Promise.all([getAllAssets(), getAllLocations(), getAllResourceTypes()]);
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

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return assets.filter((a) => {
            if (filterTypeId && a.type?.id !== Number(filterTypeId)) return false;
            if (q && !a.name.toLowerCase().includes(q) &&
                !(a.type?.name?.toLowerCase().includes(q)) &&
                !(a.location?.name?.toLowerCase().includes(q))) return false;
            return true;
        });
    }, [assets, search, filterTypeId]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const handleFilterChange = (setter) => (e) => { setter(e.target.value); setCurrentPage(1); };

    const handleSave = (saved, isEdit) => {
        setAssets((prev) => isEdit ? prev.map((a) => a.id === saved.id ? saved : a) : [...prev, saved]);
        setModal(null);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await deleteAsset(deleteTarget.id);
            setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch {
            // keep modal open, user can retry
        } finally {
            setDeleting(false);
        }
    };

    const formatId = (id) => `RES-${String(id).padStart(2, '0')}`;

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main">Resource Management Dashboard</h1>
                <p className="mt-1 text-sm text-text-muted">Manage rooms, labs, and shared campus assets.</p>
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
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    <input
                        value={search}
                        onChange={handleFilterChange(setSearch)}
                        placeholder="Search…"
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
                    />
                </div>
                <select
                    value={filterTypeId}
                    onChange={handleFilterChange(setFilterTypeId)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">All Types</option>
                    {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>

            {fetchError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{fetchError}</div>
            )}

            {/* Table */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <span className="col-span-1">ID</span>
                    <span className="col-span-3">Name</span>
                    <span className="col-span-2">Type</span>
                    <span className="col-span-2">Location</span>
                    <span className="col-span-1">Capacity/Qty</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-1 text-right">Actions</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
                            {[1, 3, 2, 2, 1, 2, 1].map((span, j) => (
                                <div key={j} className={`col-span-${span} h-4 bg-gray-100 rounded`} />
                            ))}
                        </div>
                    ))
                ) : paginated.length === 0 ? (
                    <div className="py-16 text-center text-sm text-text-muted">
                        No resources found.{(search || filterTypeId) && (
                            <button onClick={() => { setSearch(''); setFilterTypeId(''); }} className="text-primary underline ml-1">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    paginated.map((asset) => (
                        <div key={asset.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 items-center hover:bg-gray-50 transition-colors">
                            <span className="col-span-1 text-xs font-mono font-semibold text-text-muted">{formatId(asset.id)}</span>
                            <div className="col-span-3 flex items-center gap-2 min-w-0">
                                <Building2 size={15} className="text-primary shrink-0" />
                                <span className="text-sm font-medium text-text-main truncate">{asset.name}</span>
                            </div>
                            <span className="col-span-2 text-sm text-text-muted truncate">{asset.type?.name ?? '—'}</span>
                            <div className="col-span-2 flex items-center gap-1 min-w-0">
                                <MapPin size={13} className="text-text-muted shrink-0" />
                                <span className="text-sm text-text-muted truncate">
                                    {asset.location
                                        ? `${asset.location.name}${asset.location.buildingName ? ` · ${asset.location.buildingName}` : ''}`
                                        : '—'}
                                </span>
                            </div>
                            <span className="col-span-1 text-sm text-text-muted">{asset.capacity ?? '—'}</span>
                            <span className="col-span-2"><StatusBadge status={asset.status} /></span>
                            <div className="col-span-1 flex items-center justify-end gap-1.5">
                                <button
                                    onClick={() => setModal({ mode: 'edit', asset })}
                                    className="p-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(asset)}
                                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        &lsaquo; Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 text-sm rounded-lg border transition-colors ${currentPage === page ? 'bg-primary text-white border-primary font-semibold' : 'border-gray-200 text-text-muted hover:border-primary hover:text-primary'}`}>
                            {page}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        Next &rsaquo;
                    </button>
                </div>
            )}

            {/* Modals */}
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
