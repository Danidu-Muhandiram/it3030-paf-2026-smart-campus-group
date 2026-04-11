import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

// Hoisted mocks let the test control service responses before module evaluation.
const { mockFetchCurrentUser, mockLogout } = vi.hoisted(() => ({
    mockFetchCurrentUser: vi.fn(),
    mockLogout: vi.fn(),
}))

vi.mock('./authService', () => ({
    authService: {
        fetchCurrentUser: mockFetchCurrentUser,
        logout: mockLogout,
    },
}))

function AuthStateProbe() {
    // Tiny probe component to read context values for assertions.
    const { status, initialized, user } = useAuth()

    return (
        <div>
            <p data-testid="status">{status}</p>
            <p data-testid="initialized">{String(initialized)}</p>
            <p data-testid="user-state">{user ? 'present' : 'none'}</p>
        </div>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        mockFetchCurrentUser.mockReset()
        mockLogout.mockReset()
    })

    it('sets anonymous status when current user request returns 401', async () => {
        // 401 means no valid login session, so app should enter anonymous state.
        mockFetchCurrentUser.mockRejectedValueOnce({ response: { status: 401 } })

        render(
            <AuthProvider>
                <AuthStateProbe />
            </AuthProvider>
        )

        await waitFor(() => {
            // Wait until first auth check finishes before final assertions.
            expect(screen.getByTestId('initialized')).toHaveTextContent('true')
        })

        expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
        expect(screen.getByTestId('user-state')).toHaveTextContent('none')
        expect(mockFetchCurrentUser).toHaveBeenCalledTimes(1)
    })
})
