import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

export default function App() {
    const { isAuthenticated } = useAuth()

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 mb-4">Smart Campus</h1>
                </div>
            </div>
        </Router>
    )
}
