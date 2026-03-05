import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../features/auth/pages/LandingPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
    )
}
