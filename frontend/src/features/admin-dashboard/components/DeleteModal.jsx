import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Confirmation dialog for deleting a resource asset.
 */
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
                Are you sure you want to delete{' '}
                <span className="font-semibold text-text-main">"{asset.name}"</span>?
                This action cannot be undone.
            </p>

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 border border-gray-200 text-text-muted hover:border-primary hover:text-primary text-sm font-semibold py-2.5 rounded-xl"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60"
                >
                    {deleting ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

export default DeleteModal;
