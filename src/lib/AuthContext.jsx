import React, { createContext, useState, useContext, useEffect } from 'react'
import { base44 } from '@/api/base44Client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isLoadingPublicSettings] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setIsLoadingAuth(true)
        setAuthError(null)

        const { data, error } = await base44.auth.getUser()

        if (error) {
          setUser(null)
          setIsAuthenticated(false)
          setAuthError({ type: 'auth_required', message: error.message })
        } else {
          const currentUser = data?.user ?? null
          setUser(currentUser)
          setIsAuthenticated(!!currentUser)
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
        setAuthError({
          type: 'auth_required',
          message: error?.message || 'Authentication required',
        })
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkUserAuth()
  }, [])

  const logout = async () => {
    await base44.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    setAuthError(null)
  }

  const navigateToLogin = () => {
    window.location.hash = '#/'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        logout,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
