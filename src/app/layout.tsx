import type { Metadata } from 'next'
import '../styles/globals.css'
import { TRPCReactProvider } from '~/trpc/react'
import { AuthProvider } from '../contexts/auth-context'

export const metadata: Metadata = {
  title: 'Planner B - Planificación Inteligente',
  description: 'Plataforma de planificación colaborativa para estudiantes, empresas y startups',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <TRPCReactProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
