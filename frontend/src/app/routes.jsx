import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardOverview } from '../features/dashboard/pages/DashboardOverview'
import { ProfilePage } from '../features/dashboard/pages/ProfilePage'
import { TicketsPage } from '../features/tickets/pages/TicketsPage'
import { AdminOverviewPage } from '../features/admin-dashboard/pages/AdminOverviewPage'
import { AdminTicketsPage } from '../features/admin-dashboard/pages/AdminTicketsPage'
import { AdminResourcesPage } from '../features/admin-dashboard/pages/AdminResourcesPage'
import { AdminUsersPage } from '../features/admin-dashboard/pages/AdminUsersPage'
import { AdminReportsPage } from '../features/admin-dashboard/pages/AdminReportsPage'
import { AdminBookingsPage } from '../features/booking/pages/AdminBookingPage'
import { BookingRequestPage } from '../features/booking/pages/BookingRequestPage'
import { MyBookingPage } from '../features/booking/pages/MyBookingPage'
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS, TECHNICIAN_NAV_ITEMS } from './navigation/dashboardNavItems'
import { TechnicianOverviewPage } from '../features/technician-dashboard/pages/TechnicianOverviewPage'
import { TechnicianTasksPage } from '../features/technician-dashboard/pages/TechnicianTasksPage'

import { useAuth } from '../features/auth/AuthContext'

const AuthLoading = () => (
    <div className="min-h-screen bg-bg-main flex items-center justify-center font-sans text-text-main">
        <p className="text-sm font-medium">Checking your session...</p>
    </div>
)

const RequireAuth = ({ children }) => {
    const { status, initialized } = useAuth()

    // Wait for initial auth check to avoid redirect flicker.
    if (!initialized) {
        return <AuthLoading />
    }

    if (status !== 'authenticated') {
        return <Navigate to="/login" replace />
    }

    return children
}

const resolveDefaultDashboardPath = (role) =>
    String(role || '').toUpperCase() === 'ADMIN' ? '/admin' : '/dashboard'

const RequireAdmin = ({ children }) => {
    const { status, initialized, user } = useAuth()

    if (!initialized) {
        return <AuthLoading />
    }

    if (status !== 'authenticated') {
        return <Navigate to="/login" replace />
    }

    // Block non-admin users from entering admin URLs.
    if (String(user?.role || '').toUpperCase() !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

const RequireTechnician = ({ children }) => {
    const { status, initialized, user } = useAuth()

    if (!initialized) {
        return <AuthLoading />
    }

    if (status !== 'authenticated') {
        return <Navigate to="/login" replace />
    }

    if (String(user?.role?.name || '').toUpperCase() !== 'TECHNICIAN' && String(user?.role?.name || '').toUpperCase() !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />
    }

    return children
}


// Reuse one dashboard shell with user-specific navigation settings.
const UserDashboardRoute = ({ children }) => (
    <RequireAuth>
        <UserDashboardGate>{children}</UserDashboardGate>
    </RequireAuth>
)

const UserDashboardGate = ({ children }) => {
    const { user } = useAuth()

    // Keep admin users inside admin shell even if they manually open /dashboard.
    if (String(user?.role || '').toUpperCase() === 'ADMIN') {
        return <Navigate to={resolveDefaultDashboardPath(user?.role)} replace />
    }

    return (
        <DashboardLayout
            navItems={USER_NAV_ITEMS}
            profilePath="/dashboard/profile"
            brandLabel="Smart Campus"
        >
            {children}
        </DashboardLayout>
    )
}

// Reuse the same shell with admin navigation and branding.
const AdminDashboardRoute = ({ children }) => (
    <RequireAdmin>
        <DashboardLayout
            navItems={ADMIN_NAV_ITEMS}
            profilePath="/admin/profile"
            brandLabel="Campus Admin"
        >
            {children}
        </DashboardLayout>
    </RequireAdmin>
)

const TechnicianDashboardRoute = ({ children }) => (
    <RequireTechnician>
        <DashboardLayout
            navItems={TECHNICIAN_NAV_ITEMS}
            profilePath="/technician/profile"
            brandLabel="Campus Technician"
        >
            {children}
        </DashboardLayout>
    </RequireTechnician>
)


export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
                <UserDashboardRoute>
                    <DashboardOverview />
                </UserDashboardRoute>
            } />

            {/* Account profile section */}
            <Route path="/dashboard/profile" element={
                <UserDashboardRoute>
                    <ProfilePage />
                </UserDashboardRoute>
            } />

            <Route path="/dashboard/tickets" element={
                <UserDashboardRoute>
                    <TicketsPage />
                </UserDashboardRoute>
            } />

            <Route path="/dashboard/tickets/new" element={
                <UserDashboardRoute>
                    <TicketsPage />
                </UserDashboardRoute>
            } />

            <Route path="/dashboard/bookings" element={
                <UserDashboardRoute>
                    <MyBookingPage />
                </UserDashboardRoute>
            } />

            <Route path="/dashboard/bookings/new" element={
                <UserDashboardRoute>
                    <BookingRequestPage />
                </UserDashboardRoute>
            } />

            <Route path="/dashboard/bookings/request" element={
                <UserDashboardRoute>
                    <Navigate to="/dashboard/bookings/new" replace />
                </UserDashboardRoute>
            } />

            {/* Admin dashboard routes (UI scaffolding) */}
            <Route path="/admin" element={
                <AdminDashboardRoute>
                    <AdminOverviewPage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/profile" element={
                <AdminDashboardRoute>
                    <ProfilePage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/tickets" element={
                <AdminDashboardRoute>
                    <AdminTicketsPage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/bookings" element={
                <AdminDashboardRoute>
                    <AdminBookingsPage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/resources" element={
                <AdminDashboardRoute>
                    <AdminResourcesPage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/users" element={
                <AdminDashboardRoute>
                    <AdminUsersPage />
                </AdminDashboardRoute>
            } />

            <Route path="/admin/reports" element={
                <AdminDashboardRoute>
                    <AdminReportsPage />
                </AdminDashboardRoute>
            } />

            {/* Technician dashboard routes */}
            <Route path="/technician" element={
                <TechnicianDashboardRoute>
                    <TechnicianOverviewPage />
                </TechnicianDashboardRoute>
            } />

            <Route path="/technician/profile" element={
                <TechnicianDashboardRoute>
                    <ProfilePage />
                </TechnicianDashboardRoute>
            } />

            <Route path="/technician/tasks" element={
                <TechnicianDashboardRoute>
                    <TechnicianTasksPage />
                </TechnicianDashboardRoute>
            } />

        </Routes>
    )
}
