import { Routes, Route } from 'react-router-dom'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-blue-600 mb-4">Smart Campus</h1>
                    </div>
                </div>
            } />
        </Routes>
    )
}
