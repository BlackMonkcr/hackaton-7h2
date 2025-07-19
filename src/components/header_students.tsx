import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { RefreshCw, User, Settings, LogOut } from "lucide-react"

export function Header_Students() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">📚</div>
          <h1 className="text-xl font-semibold">Planner B – Modo Estudiante</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Cambiar modo
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                Juan Pérez
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Ajustes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}