import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Pencil, Plus } from 'lucide-react';
import { createResourceType, updateResourceType } from '../../../services/resourceService';

const EMPTY_TYPE = { name: '' };

const TypePickerField = ({ value, onChange, types, onTypesChange, error }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [editing, setEditing] = useState(null); // null | 'new' | typeObject
    const [form, setForm] = useState(EMPTY_TYPE);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const ref = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = types.find((t) => t.id === value);

    const openNew = () => {
        setShowDropdown(false);
        setEditing('new');
        setForm(EMPTY_TYPE);
        setFormError('');
    };

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
                onTypesChange(types.map((t) => (t.id === updated.id ? updated : t)));
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
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setShowDropdown((v) => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left transition-colors 
                    ${error ? 'border-red-400' : 'border-gray-200 hover:border-primary'} 
                    focus:outline-none focus:ring-2 focus:ring-primary/20`}
            >
                <span className={selected ? 'text-text-main' : 'text-text-muted'}>
                    {selected ? selected.name : 'Select type…'}
                </span>
                <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
            </button>

            {/* Dropdown list */}
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
                                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 
                                    ${value === type.id ? 'bg-blue-50 text-primary font-medium' : 'text-text-main'}`}
                            >
                                <span>{type.name}</span>
                                <button
                                    type="button"
                                    onClick={(e) => openEdit(type, e)}
                                    className="ml-2 p-0.5 text-text-muted hover:text-primary"
                                >
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

            {/* Inline add/edit form */}
            {editing && (
                <div className="mt-2 p-3 border border-primary/30 rounded-xl bg-blue-50 space-y-2">
                    <p className="text-xs font-semibold text-primary">
                        {editing === 'new' ? 'New Type' : 'Edit Type'}
                    </p>
                    <input
                        placeholder="Type name *"
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                        className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="flex-1 text-xs font-semibold border border-gray-200 text-text-muted hover:border-primary hover:text-primary py-1.5 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default TypePickerField;
