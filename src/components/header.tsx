"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { PlannerLogo } from "./planner-logo"
import { useAuth } from "../contexts/auth-context"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const getUserInitials = () => {
    if (!user) return "U"
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  const getDashboardUrl = () => {
    if (!user) return "/"
    
    if (user.university) {
      return "/modo/students"
    } else if (user.companyName) {
      return "/modo/pymes"
    } else {
      return "/modo/startups"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <PlannerLogo />
          <span className="text-xl font-bold text-gray-900">Planner B</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            ¿Qué es Planner B?
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Contacto / Soporte
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={getDashboardUrl()}>Dashboard</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardUrl()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
