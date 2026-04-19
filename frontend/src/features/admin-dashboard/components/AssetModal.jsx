import React, { useRef, useState } from 'react';
import { Building2, ImagePlus, X } from 'lucide-react';
import { createAsset, updateAsset, uploadImage } from '../../../services/resourceService';
import InputField from './InputField';
import LocationPickerField from './LocationPickerField';
import TypePickerField from './TypePickerField';

// Only letters, digits, spaces, hyphens, dots, commas, parentheses and single-quotes are allowed.
const NAME_PATTERN = /^[a-zA-Z0-9 \-.,()'\u0080-\uFFFF]+$/;

const STATUSES = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

const EMPTY_ASSET = {
    name: '', typeId: '', status: 'ACTIVE', capacity: '', locationId: '', imageUrl: '',
};

/**
 * Modal for creating or editing a resource asset.
 *
 * Props:
 *   asset          – existing asset object when editing; null when adding
 *   locations      – current locations array
 *   types          – current resource-types array
 *   onSave         – (savedAsset, isEdit) => void
 *   onClose        – () => void
 *   onTypesChange  – (updatedTypes) => void  (propagates inline type additions/edits)
 */
const AssetModal = ({ asset, locations, types, onSave, onClose, onTypesChange }) => {
    const isEdit = !!asset?.id;

    const [form, setForm] = useState(
        isEdit
            ? {
                  name: asset.name,
                  typeId: asset.type?.id ?? '',
                  status: asset.status,
                  capacity: asset.capacity ?? '',
                  locationId: asset.location?.id ?? '',
                  imageUrl: asset.imageUrl ?? '',
              }
            : EMPTY_ASSET
    );
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [locs, setLocs] = useState(locations);
    const [localTypes, setLocalTypes] = useState(types);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(isEdit ? (asset.imageUrl ?? '') : '');
    const fileInputRef = useRef(null);

    // ── helpers ──────────────────────────────────────────────────────────────

    /** Curried setter for text inputs */
    const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    /** Curried setter for picker components that pass a value directly */
    const setPickerField = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

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

    // ── validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const e = {};
        const trimmedName = form.name.trim();

        if (!trimmedName) {
            e.name = 'Resource name is required';
        } else if (!NAME_PATTERN.test(trimmedName)) {
            e.name = 'Name must not contain special characters (e.g. @, #, !, %, *, &, /)';
        } else if (trimmedName.length < 2) {
            e.name = 'Name must be at least 2 characters';
        } else if (trimmedName.length > 100) {
            e.name = 'Name must not exceed 100 characters';
        }

        if (!form.typeId) e.typeId = 'Type is required';
        if (!form.status) e.status = 'Status is required';
        if (!form.capacity || Number(form.capacity) <= 0) e.capacity = 'Capacity must be greater than 0';
        if (!form.locationId) e.locationId = 'Location is required';

        return e;
    };

    // ── submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSaving(true);
        try {
            let finalImageUrl = form.imageUrl;
            if (imageFile) {
                setUploading(true);
                finalImageUrl = await uploadImage(imageFile);
                setUploading(false);
            }

            const payload = {
                ...form,
                name: form.name.trim(),
                capacity: Number(form.capacity),
                locationId: Number(form.locationId),
                typeId: Number(form.typeId),
                imageUrl: finalImageUrl,
            };

            const saved = isEdit
                ? await updateAsset(asset.id, payload)
                : await createAsset(payload);

            onTypesChange(localTypes);
            onSave(saved, isEdit);
        } catch (err) {
            setUploading(false);
            setErrors({
                _global: err?.response?.data?.message ?? 'Failed to save. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    // ── render ────────────────────────────────────────────────────────────────

    const textInputCls = (field) =>
        `w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            errors[field] ? 'border-red-400' : 'border-gray-200 hover:border-primary'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-text-main">
                            {isEdit ? 'Edit Resource' : 'Add New Resource'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 text-text-muted"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors._global && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {errors._global}
                        </div>
                    )}

                    {/* Name */}
                    <InputField label="Resource Name" required error={errors.name}>
                        <input
                            value={form.name}
                            onChange={setField('name')}
                            placeholder="e.g. B401 Computing Lab"
                            maxLength={100}
                            className={textInputCls('name')}
                        />
                    </InputField>

                    {/* Type picker */}
                    <InputField label="Type" required error={null}>
                        <TypePickerField
                            value={form.typeId}
                            onChange={setPickerField('typeId')}
                            types={localTypes}
                            onTypesChange={setLocalTypes}
                            error={errors.typeId}
                        />
                    </InputField>

                    {/* Capacity + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Capacity / Quantity" required error={errors.capacity}>
                            <input
                                type="number"
                                min="1"
                                value={form.capacity}
                                onChange={setField('capacity')}
                                placeholder="e.g. 50"
                                className={textInputCls('capacity')}
                            />
                        </InputField>

                        <InputField label="Status" required error={errors.status}>
                            <select
                                value={form.status}
                                onChange={setField('status')}
                                className={`bg-white ${textInputCls('status')}`}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </InputField>
                    </div>

                    {/* Location picker */}
                    <InputField label="Location" required error={null}>
                        <LocationPickerField
                            value={form.locationId}
                            onChange={setPickerField('locationId')}
                            locations={locs}
                            onLocationsChange={setLocs}
                            error={errors.locationId}
                        />
                    </InputField>

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">
                            Resource Image{' '}
                            <span className="text-text-muted font-normal">(optional)</span>
                        </label>
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
                                    src={
                                        imagePreview.startsWith('blob:')
                                            ? imagePreview
                                            : `http://localhost:8085${imagePreview}`
                                    }
                                    alt="Resource preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <label
                                        htmlFor="resource-image-input"
                                        className="cursor-pointer text-xs font-semibold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-lg"
                                    >
                                        Change
                                    </label>
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="resource-image-input"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors"
                            >
                                <ImagePlus className="w-8 h-8 text-text-muted mb-2" />
                                <span className="text-sm text-text-muted">Click to upload image</span>
                                <span className="text-xs text-text-muted mt-0.5">
                                    JPEG, PNG, WebP or GIF · max 5 MB
                                </span>
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-200 text-text-muted hover:border-primary hover:text-primary text-sm font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                        >
                            {uploading
                                ? 'Uploading image…'
                                : saving
                                ? 'Saving…'
                                : isEdit
                                ? 'Save Changes'
                                : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetModal;
