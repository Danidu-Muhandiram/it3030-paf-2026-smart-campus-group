import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './features/auth/components/AuthLayout';
import LandingPage from './features/auth/pages/LandingPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes wrapped in AuthLayout */}
        <Route path="/" element={
          <AuthLayout>
            <LandingPage />
          </AuthLayout>
        } />

        {/* Placeholder dashboard route */}
        <Route path="/dashboard" element={
          <div>Dashboard Page (Placeholder)</div>
        } />
      </Routes>
    </Router>
  )
}

export default App
