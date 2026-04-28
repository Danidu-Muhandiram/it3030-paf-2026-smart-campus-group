import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, XCircle, RefreshCw, Eye, CheckCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    APPROVED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  };
  const { bg, text, border } = statusConfig[status] || statusConfig.CANCELLED;
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${bg} ${text} ${border}`}>
      {status}
    </span>
  );
};

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
  onReschedule,
  showAdminActions = false
}) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCardClick = () => {
    if (showAdminActions && status === 'PENDING') {
      navigate(`/admin/bookings/${id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 sm:p-5 flex flex-col md:flex-row gap-4 md:items-center group ${showAdminActions && status === 'PENDING' ? 'cursor-pointer' : ''}`}
    >
      {/* Icon/Visual */}
      <div className="hidden sm:flex w-12 h-12 bg-primary/5 rounded-xl items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
        <Calendar className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="text-base font-bold text-text-main truncate group-hover:text-primary transition-colors">{resourceName}</h3>
          <StatusBadge status={status} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={14} className="text-text-light" />
            <span>{formatDate(date)} &middot; {startTime} - {endTime}</span>
          </div>
          {attendees !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Users size={14} className="text-text-light" />
              <span>{attendees} Expected</span>
            </div>
          )}
          {purpose && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted sm:col-span-2 lg:col-span-1">
              <span className="font-medium text-text-main shrink-0">Purpose:</span>
              <span className="truncate">{purpose}</span>
            </div>
          )}
        </div>
        
        {requesterName && (
          <p className="text-[11px] text-text-light mt-2">Requested by: <span className="font-medium text-text-muted">{requesterName}</span></p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 md:mt-0 md:ml-auto">
        {!showAdminActions && (status === 'APPROVED' || status === 'PENDING') && (
          <>
            {onReschedule && status === 'APPROVED' && (
              <button
                onClick={(e) => { e.stopPropagation(); onReschedule(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-muted border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors bg-white"
              >
                <RefreshCw size={14} />
                Reschedule
              </button>
            )}
            {onCancel && (
              <button
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors bg-white"
              >
                <XCircle size={14} />
                Cancel
              </button>
            )}
          </>
        )}

        {showAdminActions && status === 'PENDING' && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onApprove?.(); }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Eye size={14} />
              Review
            </button>
          </>
        )}
      </div>
    </article>
  );
}

