import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { OAuthSuccessPage } from '../features/auth/pages/OAuthSuccessPage'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardOverview } from '../features/dashboard/pages/DashboardOverview'

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/success" element={<OAuthSuccessPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
                <DashboardLayout>
                    <DashboardOverview />
                </DashboardLayout>
            } />
        </Routes>
    )
}
