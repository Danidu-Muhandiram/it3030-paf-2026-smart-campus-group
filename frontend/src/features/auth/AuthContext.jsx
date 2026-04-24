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
        setStatus(currentStatus => {
            if (currentStatus !== 'authenticated') {
                return 'loading';
            }
            return currentStatus;
        });
        
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
            setInitialized(true)
        }
    }, [])

    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        try {
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
        updateUser,
        logout
    }), [user, status, error, initialized, refreshUser, updateUser, logout])

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
