"use client";

import { useState } from "react";
import AaronTest from "./aaron";
import GianpierTest from "./gianpier";
import CalendarTest from "./calendar";
import ProjectAITest from "./project-ai";
import CalendarExtractorTest from "./calendar-extractor";

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState("aaron");

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">🧪 Página de Pruebas</h1>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab("aaron")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "aaron"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Aaron - Auth Tests
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "calendar"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Calendar - Google
            </button>
            <button
              onClick={() => setActiveTab("calendar-extractor")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "calendar-extractor"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Calendar - Extractor
            </button>
            <button
              onClick={() => setActiveTab("project-ai")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "project-ai"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Project AI - Tests
            </button>
            <button
              onClick={() => setActiveTab("gianpier")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "gianpier"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Gianpier - Tests
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex justify-center">
          {activeTab === "aaron" && <AaronTest />}
          {activeTab === "calendar" && <CalendarTest />}
          {activeTab === "calendar-extractor" && <CalendarExtractorTest />}
          {activeTab === "project-ai" && <ProjectAITest />}
          {activeTab === "gianpier" && <GianpierTest />}
        </div>
      </div>
    </div>
  );
}
