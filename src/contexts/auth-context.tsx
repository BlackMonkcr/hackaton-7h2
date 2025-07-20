"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { api } from "../trpc/react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  username?: string
  university?: string
  career?: string
  companyName?: string
  position?: string
  createdAt: Date
  lastLoginAt?: Date
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loginMutation = api.auth.login.useMutation()
  const logoutMutation = api.auth.logout.useMutation()
  const meMutation = api.auth.me.useMutation()

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        
        // Verificar que el token siga siendo válido
        meMutation.mutateAsync({ token: savedToken })
          .then((response) => {
            setUser(response.user)
          })
          .catch(() => {
            // Token inválido, limpiar localStorage
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
            setToken(null)
            setUser(null)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } catch (error) {
        // Error al parsear, limpiar localStorage
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password })
      
      setToken(result.token)
      setUser(result.user)
      
      localStorage.setItem("authToken", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutMutation.mutateAsync({ token })
      }
    } catch (error) {
      console.error("Error al hacer logout:", error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
