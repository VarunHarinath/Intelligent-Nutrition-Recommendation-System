"use client"

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"

interface FoodRecommendation {
  id: string
  name: string
  calories: number
  protein: string
  carbs: string
  fat: string
  benefits: string[]
  icon: string
}

// Mock data - Replace with actual FastAPI backend call
const MOCK_RECOMMENDATIONS: { [key: string]: FoodRecommendation[] } = {
  "lose-weight": [
    {
      id: "1",
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: "31g",
      carbs: "0g",
      fat: "3.6g",
      benefits: ["High Protein", "Low Calorie", "Lean"],
      icon: "🍗",
    },
    {
      id: "2",
      name: "Broccoli",
      calories: 34,
      protein: "2.8g",
      carbs: "7g",
      fat: "0.4g",
      benefits: ["Very Low Calorie", "Fiber-Rich", "Nutritious"],
      icon: "🥦",
    },
    {
      id: "3",
      name: "Greek Yogurt",
      calories: 59,
      protein: "10g",
      carbs: "3.3g",
      fat: "0.4g",
      benefits: ["High Protein", "Probiotics", "Low Fat"],
      icon: "🥛",
    },
    {
      id: "4",
      name: "Egg Whites",
      calories: 17,
      protein: "3.6g",
      carbs: "0.4g",
      fat: "0.1g",
      benefits: ["Pure Protein", "Low Calorie", "Versatile"],
      icon: "🥚",
    },
  ],
  "gain-weight": [
    {
      id: "1",
      name: "Salmon",
      calories: 208,
      protein: "22g",
      carbs: "0g",
      fat: "13g",
      benefits: ["Omega-3s", "High Calorie", "Protein"],
      icon: "🐟",
    },
    {
      id: "2",
      name: "Avocado",
      calories: 160,
      protein: "2g",
      carbs: "9g",
      fat: "15g",
      benefits: ["Healthy Fats", "Calorie Dense", "Nutrients"],
      icon: "🥑",
    },
    {
      id: "3",
      name: "Whole Milk",
      calories: 61,
      protein: "3.2g",
      carbs: "4.8g",
      fat: "3.3g",
      benefits: ["Calcium", "High Calorie", "Protein"],
      icon: "🥛",
    },
    {
      id: "4",
      name: "Peanut Butter",
      calories: 188,
      protein: "8g",
      carbs: "7g",
      fat: "16g",
      benefits: ["Healthy Fats", "Protein", "Calorie Dense"],
      icon: "🥜",
    },
  ],
  "stay-healthy": [
    {
      id: "1",
      name: "Spinach",
      calories: 23,
      protein: "2.9g",
      carbs: "3.6g",
      fat: "0.4g",
      benefits: ["Iron", "Nutrients", "Low Calorie"],
      icon: "🥬",
    },
    {
      id: "2",
      name: "Blueberries",
      calories: 57,
      protein: "0.7g",
      carbs: "14g",
      fat: "0.3g",
      benefits: ["Antioxidants", "Vitamins", "Healthy"],
      icon: "🫐",
    },
    {
      id: "3",
      name: "Quinoa",
      calories: 120,
      protein: "4.4g",
      carbs: "21g",
      fat: "1.9g",
      benefits: ["Complete Protein", "Fiber", "Balanced"],
      icon: "🌾",
    },
    {
      id: "4",
      name: "Sweet Potato",
      calories: 86,
      protein: "1.6g",
      carbs: "20g",
      fat: "0.1g",
      benefits: ["Vitamins", "Fiber", "Healthy"],
      icon: "🍠",
    },
  ],
  "build-muscle": [
    {
      id: "1",
      name: "Lean Beef",
      calories: 180,
      protein: "26g",
      carbs: "0g",
      fat: "8g",
      benefits: ["High Protein", "Iron", "B Vitamins"],
      icon: "🥩",
    },
    {
      id: "2",
      name: "Chickpeas",
      calories: 269,
      protein: "15g",
      carbs: "45g",
      fat: "4.3g",
      benefits: ["Plant Protein", "Fiber", "Carbs"],
      icon: "🫘",
    },
    {
      id: "3",
      name: "Rice",
      calories: 130,
      protein: "2.7g",
      carbs: "28g",
      fat: "0.3g",
      benefits: ["Carbs", "Energy", "Budget-Friendly"],
      icon: "🍚",
    },
    {
      id: "4",
      name: "Cottage Cheese",
      calories: 98,
      protein: "11g",
      carbs: "3.4g",
      fat: "5g",
      benefits: ["Casein Protein", "Calcium", "Satiating"],
      icon: "🥣",
    },
  ],
}

function RecommendationsContent() {
  const searchParams = useSearchParams()
  const goal = searchParams.get("goal") || "stay-healthy"
  const allergies = searchParams.get("allergies")?.split(",").filter(Boolean) || []
  const preferences = searchParams.get("preferences")?.split(",").filter(Boolean) || []
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([])

  useEffect(() => {
    // TODO: Replace with actual FastAPI backend call
    // Example:
    // const fetchRecommendations = async () => {
    //   const response = await fetch('/api/recommendations', {
    //     method: 'POST',
    //     body: JSON.stringify({ goal, allergies, preferences })
    //   })
    //   const data = await response.json()
    //   setRecommendations(data)
    // }
    setRecommendations(MOCK_RECOMMENDATIONS[goal] || MOCK_RECOMMENDATIONS["stay-healthy"])
  }, [goal])

  const goalLabels: { [key: string]: string } = {
    "lose-weight": "Lose Weight",
    "gain-weight": "Gain Weight",
    "stay-healthy": "Stay Healthy",
    "build-muscle": "Build Muscle",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Your Recommendations</h1>
              <p className="text-xl text-muted-foreground">Personalized foods for {goalLabels[goal]}</p>
            </div>

            {(allergies.length > 0 || preferences.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy) => (
                  <div key={allergy} className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm">
                    No {allergy}
                  </div>
                ))}
                {preferences.map((pref) => (
                  <div key={pref} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                    {pref}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((food) => (
              <Card key={food.id} className="p-6 hover:shadow-lg transition-shadow hover:border-primary/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{food.icon}</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{food.calories}</div>
                    <div className="text-sm text-muted-foreground">calories</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{food.name}</h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <div className="text-sm font-semibold text-primary">{food.protein}</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <div className="text-sm font-semibold text-accent">{food.carbs}</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <div className="text-sm font-semibold">{food.fat}</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {food.benefits.map((benefit) => (
                    <span key={benefit} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                      {benefit}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/goals")} variant="outline" className="flex-1">
              Change Goal
            </Button>
            <Button onClick={() => router.push("/preferences?goal=" + goal)} variant="outline" className="flex-1">
              Update Preferences
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              New Search
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center min-h-screen">Loading recommendations...</div>}
    >
      <RecommendationsContent />
    </Suspense>
  )
}
