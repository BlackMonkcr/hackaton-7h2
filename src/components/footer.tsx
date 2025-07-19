import Link from "next/link"
import { PlannerLogo } from "./planner-logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <PlannerLogo />
              <span className="text-xl font-bold">Planner B</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              La plataforma de planificación que escala contigo, desde proyectos universitarios hasta operaciones
              empresariales globales.
            </p>
          </div>

          {/* Enlaces legales */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-400 hover:text-white transition-colors">
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y soporte */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Centro de ayuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Planner B. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
