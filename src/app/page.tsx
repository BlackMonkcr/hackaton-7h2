"use client"

import { useState } from "react"
import { Header } from "../components/header"
import { HeroSection } from "../components/hero-section"
import { ModeSelectionModal } from "../components/mode-selection-modal"
import { FeaturesSection } from "../components/features-section"
import { Footer } from "../components/footer"

export default function HomePage() {
  const [showModeSelection, setShowModeSelection] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main>
        <HeroSection onStartProject={() => setShowModeSelection(true)} />
        <FeaturesSection />
      </main>
      <Footer />
      <ModeSelectionModal open={showModeSelection} onOpenChange={setShowModeSelection} />
    </div>
  )
}
