"use client"

import { useState } from "react"
import { Header } from "../components/header"
import { PersonalTab } from "../components/personal-tab"
import { GroupProjectsTab } from "../components/group-projects-tab"
import { PersonalScheduleTab } from "../components/personal-schedule-tab"

export default function StudentPlanner() {
  const [activeTab, setActiveTab] = useState<"personal" | "group" | "schedule">("personal")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Navigation Tabs */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "personal"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🧍‍♂️</span>
              <span>Personal</span>
            </button>
            <button
              onClick={() => setActiveTab("group")}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "group"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>👥</span>
              <span>Proyectos Grupales</span>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "schedule"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🕒</span>
              <span>Horario Personal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "personal" && <PersonalTab />}
        {activeTab === "group" && <GroupProjectsTab />}
        {activeTab === "schedule" && <PersonalScheduleTab />}
      </main>
    </div>
  )
}