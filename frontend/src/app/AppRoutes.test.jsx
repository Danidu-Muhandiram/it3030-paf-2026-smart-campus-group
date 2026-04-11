import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AppRoutes } from './routes'

// Hoisted mock so each test can control auth state before imports use it.
const { mockUseAuth } = vi.hoisted(() => ({
    mockUseAuth: vi.fn(),
}))

vi.mock('../features/auth/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}))

vi.mock('../features/auth/pages/LandingPage', () => ({
    LandingPage: () => <div>Landing Page</div>,
}))

vi.mock('../features/auth/pages/RegisterPage', () => ({
    RegisterPage: () => <div>Register Page</div>,
}))

vi.mock('../features/auth/pages/LoginPage', () => ({
    LoginPage: () => <div>Login Page</div>,
}))

vi.mock('../components/layout/DashboardLayout', () => ({
    DashboardLayout: ({ children }) => <div>{children}</div>,
}))

vi.mock('../features/dashboard/pages/DashboardOverview', () => ({
    DashboardOverview: () => <div>Dashboard Overview</div>,
}))

describe('AppRoutes auth guard', () => {
    beforeEach(() => {
        mockUseAuth.mockReset()
    })

    it('shows loading text while auth is not initialized', () => {
        // Simulate the app still checking the session on startup.
        mockUseAuth.mockReturnValue({ status: 'loading', initialized: false })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        )

        expect(screen.getByText(/checking your session/i)).toBeInTheDocument()
    })

    it('redirects anonymous users from dashboard to login', () => {
        // Simulate a user who is known to be unauthenticated.
        mockUseAuth.mockReturnValue({ status: 'anonymous', initialized: true })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        )

        expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
})
