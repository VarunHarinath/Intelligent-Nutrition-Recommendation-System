"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/goals")
  }

  const handleAIChat = () => {
    router.push("/ai-chat")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header onAuthClick={() => setShowAuth(true)} />

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                Your Personalized Nutrition Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Get AI-powered food recommendations tailored to your health goals and preferences
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsLogin(false)
                  setShowAuth(true)
                }}
              >
                Create Account
              </Button>
            </div>

            {/* Features List */}
            <div className="pt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs font-bold">✓</span>
                </div>
                <span>Choose your health goal (lose weight, gain weight, stay healthy)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs font-bold">✓</span>
                </div>
                <span>Tell us your dietary preferences and allergies</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-xs font-bold">✓</span>
                </div>
                <span>Receive personalized food recommendations instantly</span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Card with AI Chat Button */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-sm bg-primary/5 border-primary/20 p-12 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleAIChat}
                  className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-primary/30 group"
                  aria-label="Ask AI Assistant"
                >
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-300">
                    ✨
                  </span>
                </button>
                <p className="text-sm text-muted-foreground font-medium">Ask AI</p>
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-primary">Smart Nutrition</h2>
                <p className="text-muted-foreground">
                  Powered by AI to match your unique health profile
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-8 border border-primary/10 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="text-4xl">🎯</div>
              <h3 className="font-semibold text-lg">Smart Matching</h3>
              <p className="text-muted-foreground text-sm">
                Uses nutrient similarity to find foods perfect for your goals
              </p>
            </div>
          </Card>

          <Card className="p-8 border border-primary/10 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="text-4xl">❤️</div>
              <h3 className="font-semibold text-lg">Health Conscious</h3>
              <p className="text-muted-foreground text-sm">
                Recommendations aligned with your specific health objectives
              </p>
            </div>
          </Card>

          <Card className="p-8 border border-primary/10 hover:border-primary/30 transition-colors">
            <div className="space-y-4">
              <div className="text-4xl">✨</div>
              <h3 className="font-semibold text-lg">Preference Aware</h3>
              <p className="text-muted-foreground text-sm">
                Respects your allergies and food preferences automatically
              </p>
            </div>
          </Card>
        </div>
      </main>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        isLogin={isLogin}
        onToggle={() => setIsLogin(!isLogin)}
      />
    </div>
  )
}