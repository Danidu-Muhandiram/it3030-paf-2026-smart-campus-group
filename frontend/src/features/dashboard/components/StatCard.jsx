import React from 'react';

export const StatCard = ({ title, value, icon, trend, trendValue, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${colorClass || 'bg-primary/10 text-primary'}`}>
                    {icon}
                </div>
                {trendValue && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trend === 'up' ? '+' : '-'}{trendValue}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-text-muted text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-text-main mt-1">{value}</p>
            </div>
        </div>
    );
};
