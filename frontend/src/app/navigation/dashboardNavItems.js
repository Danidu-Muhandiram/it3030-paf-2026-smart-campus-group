import { BarChart3, Building2, CalendarCheck, LayoutDashboard, Ticket, Users } from 'lucide-react'

// Navigation used by the user dashboard
export const USER_NAV_ITEMS = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/facilities', icon: Building2, label: 'Facilities Catalogue' },
    { path: '/dashboard/bookings', icon: CalendarCheck, label: 'My Bookings' },
    { path: '/dashboard/tickets', icon: Ticket, label: 'Maintenance Tickets' }
]

// Navigation used by the admin dashboard
export const ADMIN_NAV_ITEMS = [
    { path: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { path: '/admin/bookings', icon: CalendarCheck, label: 'Booking Management' },
    { path: '/admin/tickets', icon: Ticket, label: 'Ticket Management' },
    { path: '/admin/resources', icon: Building2, label: 'Resource Management' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' }
]

// Navigation used by the technician dashboard
export const TECHNICIAN_NAV_ITEMS = [
    { path: '/technician', icon: LayoutDashboard, label: 'Overview' },
    { path: '/technician/tasks', icon: Ticket, label: 'Assigned Tasks' }
]

