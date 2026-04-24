import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
    it('renders the title and auth navigation links', () => {
        // Router context is required because page uses react-router Link components.
        //In tests, we use MemoryRouter instead of BrowserRouter
        //So this creates a fake navigation environment.

        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        //Check if the main heading is displayed on the page
        expect(screen.getByRole('heading', { name: /smart campus operations, simplified/i })).toBeInTheDocument()
        //Finds a link with text “Sign in” and Checks its URL is /login
        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
        expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '/register')
    })
})
