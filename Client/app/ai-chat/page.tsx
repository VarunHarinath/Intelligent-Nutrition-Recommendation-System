"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  content: string | object
  sender: "user" | "ai"
  timestamp: string
}

const AnimatedDots = () => (
  <div className="flex items-center gap-1">
    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
  </div>
)

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "meal">("chat")
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your NutriSmart AI Assistant. Ask me anything about nutrition, health goals, or meal recommendations.",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ])
  const [mealMessages, setMealMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, mealMessages, activeTab])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    const currentMessages = activeTab === "chat" ? chatMessages : mealMessages
    const setMessages = activeTab === "chat" ? setChatMessages : setMealMessages

    setMessages([...currentMessages, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = activeTab === "chat" ? "/chat" : "/data"
      const response = await axios.post(`http://localhost:8000/api/v1${endpoint}`, { data: input })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.data || response.data || "No response received.",
        sender: "ai",
        timestamp: response.data.timestamp || new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      let errorMessage = "Unable to connect to the AI service."

      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = err.response.data.error
      }

      setError(errorMessage)

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        content: `Error: ${errorMessage}`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeMessages = activeTab === "chat" ? chatMessages : mealMessages

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <Header />

      {/* Tab Toggle */}
      <div className="flex items-center justify-center mt-6 mb-4">
        <div className="bg-muted p-1 rounded-lg flex gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "chat"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("meal")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "meal"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Meal Plan
          </button>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl flex flex-col">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold">
            {activeTab === "chat" ? "AI Nutrition Assistant" : "AI Meal Plan Generator"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {activeTab === "chat"
              ? "Ask me anything about your nutrition, health goals, or diet."
              : "Get personalized meal plans based on your preferences and goals."}
          </p>
        </div>

        {/* Messages / Meal Output */}
        <Card className="flex-1 flex flex-col max-h-[70vh] p-6 mb-6 bg-card border border-primary/10">
          <div className="flex-1 overflow-y-auto space-y-4">
            {activeTab === "chat"
              ? activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {message.sender === "ai" ? (
                        <div className="text-sm whitespace-pre-wrap">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {typeof message.content === "string"
                              ? message.content
                              : JSON.stringify(message.content, null, 2)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              : activeMessages.length > 0
              ? activeMessages.map((meal) => (
                  <div key={meal.id} className="text-sm whitespace-pre-wrap">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typeof meal.content === "string"
                        ? meal.content
                        : JSON.stringify(meal.content, null, 2)}
                    </ReactMarkdown>
                  </div>
                ))
              : "🍽️ Your generated meal plan will appear here."}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-muted text-foreground rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <AnimatedDots />
                    <span className="text-sm ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-4 bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {/* Input Area */}
        <Card className="p-4 bg-card border border-primary/10 flex flex-col gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              activeTab === "chat"
                ? "Ask me anything about nutrition..."
                : "Enter your meal preferences or goals..."
            }
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Send
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Press Enter to send or Shift+Enter for new line
          </p>
        </Card>
      </main>
    </div>
  )
}