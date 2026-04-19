import React from 'react';

const STATUS_STYLES = {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    OUT_OF_SERVICE: 'bg-red-100 text-red-700 border-red-200',
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${
            STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
        }`}
    >
        {status?.replace('_', ' ')}
    </span>
);

export default StatusBadge;
