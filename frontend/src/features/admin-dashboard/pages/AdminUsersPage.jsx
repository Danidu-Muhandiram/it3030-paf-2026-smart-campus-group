import React from 'react';
import { ShieldCheck, UserCircle2 } from 'lucide-react';

export const AdminUsersPage = () => {
    // sampleusers for layout preview before user-management APIs are connected.
    const users = [
        { name: 'Sarah Perera', email: 'sarah.perera@smartcampus.edu', role: 'ADMIN', status: 'Active' },
        { name: 'Nuwan Silva', email: 'nuwan.silva@smartcampus.edu', role: 'STUDENT', status: 'Active' },
        { name: 'Ayesha Fernando', email: 'ayesha.fernando@smartcampus.edu', role: 'STAFF', status: 'Pending' },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">User Management</h1>
                <p className="mt-1 text-text-muted">Review user roles and account lifecycle status.</p>
            </div>

            <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {users.map((user, index) => (
                    <div key={user.email} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 ${index !== users.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="flex items-start gap-3">
                            <UserCircle2 size={28} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-text-main">{user.name}</p>
                                <p className="text-xs text-text-muted mt-1">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                <ShieldCheck size={12} />
                                {user.role}
                            </span>
                            <span className={`text-xs font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-orange-600'}`}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
