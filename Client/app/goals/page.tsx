"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"

const HEALTH_GOALS = [
  {
    id: "lose-weight",
    title: "Lose Weight",
    description: "Low-calorie, high-protein foods",
    icon: "📉",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "gain-weight",
    title: "Gain Weight",
    description: "High-calorie, nutrient-dense foods",
    icon: "📈",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "stay-healthy",
    title: "Stay Healthy",
    description: "Balanced nutrition for wellness",
    icon: "✨",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "build-muscle",
    title: "Build Muscle",
    description: "High-protein recovery foods",
    icon: "💪",
    color: "from-purple-500/20 to-pink-500/20",
  },
]

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedGoal) {
      router.push(`/preferences?goal=${selectedGoal}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">What's Your Health Goal?</h1>
            <p className="text-xl text-muted-foreground">
              Choose your primary objective to get personalized recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {HEALTH_GOALS.map((goal) => (
              <Card
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-8 cursor-pointer transition-all hover:shadow-lg ${
                  selectedGoal === goal.id ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center text-3xl mb-4`}
                >
                  {goal.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
                <p className="text-muted-foreground mb-4">{goal.description}</p>

                <div className={`h-1 rounded-full ${selectedGoal === goal.id ? "bg-primary" : "bg-border"}`} />
              </Card>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
