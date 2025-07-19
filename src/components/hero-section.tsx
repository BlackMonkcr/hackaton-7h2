"use client"

import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  onStartProject: () => void
}

export function HeroSection({ onStartProject }: HeroSectionProps) {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Planner B</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Diseñado para escalar desde un proyecto de universidad hasta la gestión operativa de una empresa
          transnacional.
        </p>

        <Button
          size="lg"
          onClick={onStartProject}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          🟩 Empezar mi proyecto
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
