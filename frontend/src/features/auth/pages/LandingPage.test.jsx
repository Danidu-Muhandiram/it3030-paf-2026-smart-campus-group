import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
    it('renders the title and auth navigation links', () => {
        // Router context is required because page uses react-router Link components.
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', { name: /smart campus operations, simplified/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
        expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '/register')
    })
})
