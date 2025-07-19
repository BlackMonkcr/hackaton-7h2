import Link from "next/link"
import { Button } from "./ui/button"
import { PlannerLogo } from "./planner-logo"

export function Header() {
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
