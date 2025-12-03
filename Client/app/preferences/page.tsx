"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"

const COMMON_ALLERGIES = ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Fish", "Shellfish", "Soy", "Wheat", "Sesame"]

const DIETARY_PREFERENCES = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-FODMAP",
  "Kosher",
  "Halal",
]

function PreferencesContent() {
  const searchParams = useSearchParams()
  const goal = searchParams.get("goal") || "stay-healthy"
  const router = useRouter()

  const [allergies, setAllergies] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState("")
  const [customPreference, setCustomPreference] = useState("")

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) => (prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]))
  }

  const togglePreference = (pref: string) => {
    setPreferences((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]))
  }

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy)) {
      setAllergies([...allergies, customAllergy])
      setCustomAllergy("")
    }
  }

  const addCustomPreference = () => {
    if (customPreference.trim() && !preferences.includes(customPreference)) {
      setPreferences([...preferences, customPreference])
      setCustomPreference("")
    }
  }

  const handleGetRecommendations = () => {
    const params = new URLSearchParams({
      goal,
      allergies: allergies.join(","),
      preferences: preferences.join(","),
    })
    router.push(`/recommendations?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Your Preferences</h1>
            <p className="text-xl text-muted-foreground">Tell us about your allergies and dietary preferences</p>
          </div>

          {/* Allergies Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Known Allergies</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {COMMON_ALLERGIES.map((allergy) => (
                  <Card
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`p-3 cursor-pointer transition-all text-center ${
                      allergies.includes(allergy)
                        ? "ring-2 ring-destructive bg-destructive/10"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {allergy}
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom allergy..."
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomAllergy()}
                />
                <Button onClick={addCustomAllergy} variant="outline">
                  Add
                </Button>
              </div>

              {allergies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <div
                      key={allergy}
                      className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {allergy}
                      <button onClick={() => toggleAllergy(allergy)} className="hover:opacity-70">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Dietary Preferences</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {DIETARY_PREFERENCES.map((pref) => (
                  <Card
                    key={pref}
                    onClick={() => togglePreference(pref)}
                    className={`p-3 cursor-pointer transition-all text-center ${
                      preferences.includes(pref) ? "ring-2 ring-accent bg-accent/10" : "hover:border-primary/50"
                    }`}
                  >
                    {pref}
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add custom preference..."
                  value={customPreference}
                  onChange={(e) => setCustomPreference(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomPreference()}
                />
                <Button onClick={addCustomPreference} variant="outline">
                  Add
                </Button>
              </div>

              {preferences.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {preferences.map((pref) => (
                    <div
                      key={pref}
                      className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {pref}
                      <button onClick={() => togglePreference(pref)} className="hover:opacity-70">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleGetRecommendations}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Recommendations
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreferencesContent />
    </Suspense>
  )
}
