const statusConfig = {
  PENDING: {
    label: 'Pending',
    className: 'bg-orange-100 text-orange-800 border border-orange-300'
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border border-green-300'
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border border-red-300'
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800 border border-gray-300'
  }
};

export function StatusBadge({ status, className }) {
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.className} ${className || ''}`}>
      {config.label}
    </span>
  );
}
