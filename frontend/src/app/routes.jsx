import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardOverview } from '../features/dashboard/pages/DashboardOverview'
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

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
                <RequireAuth>
                    <DashboardLayout>
                        <DashboardOverview />
                    </DashboardLayout>
                </RequireAuth>
            } />
        </Routes>
    )
}
