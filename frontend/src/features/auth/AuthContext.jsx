import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from './authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    // status describes auth result; 
    // initialized tells whether first check finished.
    const [status, setStatus] = useState('loading')
    const [initialized, setInitialized] = useState(false)
    const [error, setError] = useState(null)

    const refreshUser = useCallback(async () => {
        setStatus('loading')
        setError(null)
        try {
            const data = await authService.fetchCurrentUser()
            setUser(data)
            setStatus('authenticated')
        } catch (err) {
            setUser(null)
            if (err?.response?.status === 401) {
                setStatus('anonymous')
            } else {
                setStatus('error')
                setError(err)
            }
        } finally {
            // Route guards should wait for this before redirecting.
            setInitialized(true)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            // Backend clears HttpOnly cookie.
            await authService.logout()
        } finally {
            setUser(null)
            setStatus('anonymous')
        }
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const value = useMemo(() => ({
        user,
        status,
        error,
        initialized,
        refreshUser,
        logout
    }), [user, status, error, initialized, refreshUser, logout])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
