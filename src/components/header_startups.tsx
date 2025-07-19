"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  Rocket,
  Brain,
  User,
  Settings,
  Briefcase,
  CheckSquare,
  Users,
  Archive,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react"

import type { TabType } from "~/app/modo/startups/page"

interface HeaderProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  showAI: boolean
  setShowAI: (show: boolean) => void
  showMetrics: boolean
  setShowMetrics: (show: boolean) => void
}

export function Header({ activeTab, setActiveTab, showAI, setShowAI, showMetrics, setShowMetrics }: HeaderProps) {
  const tabs = [
    { id: "personal" as TabType, label: "Tareas personales", icon: CheckSquare },
    { id: "projects" as TabType, label: "Proyectos colaborativos", icon: Users },
    { id: "backlog" as TabType, label: "Backlog general", icon: Archive },
    { id: "sprint" as TabType, label: "Sprint actual", icon: Zap },
    { id: "schedule" as TabType, label: "Agenda y disponibilidad", icon: Calendar },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-6 py-3">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Rocket className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Planner B</h1>
              <p className="text-sm text-gray-500">Modo Startups</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={showAI ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>IA Estratega</span>
              <Badge variant="secondary" className="ml-1">
                Pro
              </Badge>
            </Button>

            <Button
              variant={showMetrics ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Briefcase className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}