import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../authService'

export const OAuthSuccessPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if (!token) {
            navigate('/login', { replace: true })
            return
        }

        authService.setToken(token)
        navigate('/dashboard', { replace: true })
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main">
            <p className="text-lg font-medium">Signing you in...</p>
        </div>
    )
}
