"use client"

import { useState } from "react"
import { Header_startups } from "~/components/header_startups"
import { PersonalTasks } from "~/components/personal-tasks"
import { CollaborativeProjects } from "~/components/collaborative-projects"
import { GeneralBacklog } from "~/components/general-backlog"
import { CurrentSprint } from "~/components/current-sprint"
import { ScheduleAvailability } from "~/components/schedule-availability"
import { AIStrategist } from "~/components/ai-strategist"
import { MetricsPanel } from "~/components/metrics-panel"

export type TabType = "personal" | "projects" | "backlog" | "sprint" | "schedule"

export default function PlannerApp() {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [showAI, setShowAI] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

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
      <Header_startups
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showAI={showAI}
        setShowAI={setShowAI}
        showMetrics={showMetrics}
        setShowMetrics={setShowMetrics}
      />

      <main className="pt-16">{renderActiveTab()}</main>

      {showAI && <AIStrategist onClose={() => setShowAI(false)} />}

      {showMetrics && <MetricsPanel onClose={() => setShowMetrics(false)} />}
    </div>
  )
}
