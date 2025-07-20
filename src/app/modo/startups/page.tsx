"use client"

import { useState, useEffect } from "react"
import { Header_startups as HeaderStartups } from "~/components/header_startups"
import { PersonalTasks } from "~/components/personal-tasks-real"
import { CollaborativeProjects } from "~/components/collaborative-projects-real"
import { GeneralBacklog } from "~/components/general-backlog-real"
import { CurrentSprint } from "~/components/current-sprint-real"
import { ScheduleAvailability } from "~/components/schedule-availability-real"
import { AIStrategist } from "~/components/ai-strategist-real"
import { MetricsPanel } from "~/components/metrics-panel-real"
import { AIProjectGenerator } from "~/components/ai-project-generator"

export type TabType = "personal" | "projects" | "backlog" | "sprint" | "schedule"

export default function PlannerApp() {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [showAI, setShowAI] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showAIProjectGenerator, setShowAIProjectGenerator] = useState(false)
  const [authToken, setAuthToken] = useState<string>("")

  useEffect(() => {
    // Cargar token desde localStorage
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTasks />
      case "projects":
        return <CollaborativeProjects />
      case "backlog":
        return <GeneralBacklog />
      case "sprint":
        return <CurrentSprint />
      case "schedule":
        return <ScheduleAvailability />
      default:
        return <PersonalTasks />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderStartups
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showAI={showAI}
        setShowAI={setShowAI}
        showMetrics={showMetrics}
        setShowMetrics={setShowMetrics}
      />

      <main className="pt-30">
        {renderActiveTab()}

        {/* Botón flotante para generar proyecto con IA */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAIProjectGenerator(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            🤖 Generar Proyecto con IA
          </button>
        </div>
      </main>

      {showAI && <AIStrategist onClose={() => setShowAI(false)} />}

      {showMetrics && <MetricsPanel onClose={() => setShowMetrics(false)} />}

      {showAIProjectGenerator && (
        <AIProjectGenerator
          isOpen={showAIProjectGenerator}
          onClose={() => setShowAIProjectGenerator(false)}
          token={authToken}
        />
      )}
    </div>
  )
}
