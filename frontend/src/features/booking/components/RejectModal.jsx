import { useState } from 'react';

export function RejectModal({ isOpen, onClose, onConfirm, isLoading = false }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    if (reason.length > 500) {
      setError('Reason must be 500 characters or less');
      return;
    }

    onConfirm(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Reject Booking</h2>
          <p className="text-sm text-gray-600 mt-1">
            Please provide a reason for rejecting this booking request.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <textarea
              placeholder="Enter reason for rejection..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 border rounded-md resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600">
                {reason.length}/500 characters
              </p>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-2 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Rejecting...' : 'Reject Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
