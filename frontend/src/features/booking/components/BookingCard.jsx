export function BookingCard({
  resourceName,
  date,
  startTime,
  endTime,
  purpose,
  status,
  requesterName,
  attendees,
  onCancel,
  onApprove,
  onReject,
  showAdminActions = false
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold">{resourceName}</h3>
            <p className="text-sm text-gray-600">
              {formatDate(date)} • {startTime} - {endTime}
            </p>
          </div>
          {getStatusBadge(status)}
        </div>
      </div>
      <div className="p-6 pt-3 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Purpose</p>
          <p className="text-sm text-foreground">{purpose}</p>
        </div>
        
        {requesterName && (
          <div>
            <p className="text-sm font-medium text-gray-600">Requester</p>
            <p className="text-sm text-foreground">{requesterName}</p>
          </div>
        )}
        
        {attendees !== undefined && (
          <div>
            <p className="text-sm font-medium text-gray-600">Expected Attendees</p>
            <p className="text-sm text-foreground">{attendees}</p>
          </div>
        )}

        {/* User Actions */}
        {!showAdminActions && status === 'APPROVED' && onCancel && (
          <div className="pt-2 border-t">
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Admin Actions */}
        {showAdminActions && status === 'PENDING' && (
          <div className="pt-2 border-t flex gap-2">
            <button
              onClick={onApprove}
              className="flex-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="flex-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
