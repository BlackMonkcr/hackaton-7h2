"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthGuard({ children, redirectTo = "/login", requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirigir al login si se requiere autenticación y no está autenticado
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      } else if (!requireAuth && isAuthenticated) {
        // Redirigir al dashboard si no se requiere autenticación pero está autenticado
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-bounce mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // No mostrar contenido si se requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // No mostrar contenido si no se requiere autenticación pero está autenticado
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Hook personalizado para usar en componentes que necesitan verificar autenticación
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading, user }
}
