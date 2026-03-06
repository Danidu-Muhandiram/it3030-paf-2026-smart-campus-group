import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    )
}
