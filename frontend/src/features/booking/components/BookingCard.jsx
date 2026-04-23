import { useNavigate } from 'react-router-dom';

export function BookingCard({
  id,
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
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    if (showAdminActions && status === 'PENDING') {
      navigate(`/admin/bookings/${id}`);
    }
  };

  const handleApproveClick = (e) => {
    e.stopPropagation();
    if (showAdminActions && status === 'PENDING') {
      navigate(`/admin/bookings/${id}`);
    } else if (onApprove) {
      onApprove();
    }
  };

  const handleRejectClick = (e) => {
    e.stopPropagation();
    if (showAdminActions && status === 'PENDING') {
      navigate(`/admin/bookings/${id}`);
    } else if (onReject) {
      onReject();
    }
  };

  return (
    <div 
      className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow ${showAdminActions && status === 'PENDING' ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
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
              onClick={handleApproveClick}
              className="flex-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
            >
              View Details
            </button>
            <button
              onClick={handleRejectClick}
              className="flex-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

