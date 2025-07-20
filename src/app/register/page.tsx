"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { PlannerLogo } from "../../components/planner-logo"
import { api } from "../../trpc/react"
import { useAuth } from "../../contexts/auth-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    userType: "", // "student", "company", "startup"
    // Student fields
    university: "",
    studentId: "",
    career: "",
    semester: "",
    // Company fields
    companyName: "",
    position: "",
    industry: "",
    companySize: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const registerMutation = api.auth.register.useMutation()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/'
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, searchParams])

  // Configurar tipo de usuario basado en el parámetro mode
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode) {
      let userType = ""
      if (mode === "students") userType = "student"
      else if (mode === "pymes" || mode === "enterprise") userType = "company"
      else if (mode === "startups") userType = "startup"
      
      if (userType) {
        setFormData(prev => ({ ...prev, userType }))
      }
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const registerData: any = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username || undefined,
      }

      // Add specific fields based on user type
      if (formData.userType === "student") {
        registerData.university = formData.university || undefined
        registerData.studentId = formData.studentId || undefined
        registerData.career = formData.career || undefined
        registerData.semester = formData.semester ? parseInt(formData.semester) : undefined
      } else if (formData.userType === "company") {
        registerData.companyName = formData.companyName || undefined
        registerData.position = formData.position || undefined
        registerData.industry = formData.industry || undefined
        registerData.companySize = formData.companySize ? parseInt(formData.companySize) : undefined
      }

      const result = await registerMutation.mutateAsync(registerData)

      // Guardar token en localStorage (esto será manejado por el contexto después)
      localStorage.setItem("authToken", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      // Redirigir según el tipo de usuario
      const mode = searchParams.get('mode')
      if (mode) {
        router.push(`/modo/${mode}`)
      } else if (formData.userType === "student") {
        router.push("/modo/students")
      } else if (formData.userType === "company") {
        router.push("/modo/pymes")
      } else {
        router.push("/modo/startups")
      }
    } catch (error: any) {
      setError(error.message || "Error al registrar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const getModeTitle = () => {
    const mode = searchParams.get('mode')
    if (mode === "students") return "Registro para Estudiantes"
    if (mode === "pymes") return "Registro para PyMEs"
    if (mode === "startups") return "Registro para Startups"
    if (mode === "enterprise") return "Registro para Empresas"
    return "Crear cuenta"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <PlannerLogo />
            <span className="text-2xl font-bold text-gray-900">Planner B</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{getModeTitle()}</CardTitle>
            <CardDescription className="text-center">
              Completa los datos para crear tu cuenta en Planner B
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username (opcional)</Label>
                <Input
                  id="username"
                  placeholder="tu_username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              {/* Tipo de usuario - Solo mostrar si no viene de un modo específico */}
              {!searchParams.get('mode') && (
                <div className="space-y-2">
                  <Label>Tipo de usuario</Label>
                  <Select onValueChange={(value) => handleInputChange("userType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu tipo de usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Estudiante universitario</SelectItem>
                      <SelectItem value="company">Empresa/PyME</SelectItem>
                      <SelectItem value="startup">Startup/Emprendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Campos específicos para estudiantes */}
              {formData.userType === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="university">Universidad</Label>
                    <Input
                      id="university"
                      placeholder="Nombre de tu universidad"
                      value={formData.university}
                      onChange={(e) => handleInputChange("university", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">ID Estudiante</Label>
                      <Input
                        id="studentId"
                        placeholder="Tu ID de estudiante"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semestre</Label>
                      <Input
                        id="semester"
                        type="number"
                        placeholder="1-20"
                        min="1"
                        max="20"
                        value={formData.semester}
                        onChange={(e) => handleInputChange("semester", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera</Label>
                    <Input
                      id="career"
                      placeholder="Tu carrera universitaria"
                      value={formData.career}
                      onChange={(e) => handleInputChange("career", e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Campos específicos para empresas */}
              {formData.userType === "company" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Nombre de tu empresa"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        placeholder="Tu cargo"
                        value={formData.position}
                        onChange={(e) => handleInputChange("position", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Tamaño empresa</Label>
                      <Input
                        id="companySize"
                        type="number"
                        placeholder="Nº empleados"
                        value={formData.companySize}
                        onChange={(e) => handleInputChange("companySize", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industria</Label>
                    <Input
                      id="industry"
                      placeholder="Industria o sector"
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !formData.userType}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:underline">
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
