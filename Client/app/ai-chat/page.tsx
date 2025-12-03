"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import axios from "axios"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
}

const AnimatedDots = () => (
  <div className="flex items-center gap-1">
    <span 
      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
      style={{ animationDelay: "0s" }} 
    />
    <span 
      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
      style={{ animationDelay: "0.2s" }} 
    />
    <span 
      className="w-2 h-2 rounded-full bg-primary animate-bounce" 
      style={{ animationDelay: "0.4s" }} 
    />
  </div>
)

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your NutriSmart AI Assistant. Ask me anything about nutrition, your health goals, food recommendations, or dietary preferences. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:8000/api/v1/data", {
        data: input,
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.content || "I received your message but couldn't generate a response. Please try again.",
        sender: "ai",
        timestamp: response.data.timestamp || new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      let errorMessage = "Unable to connect to the AI service. Please check if your backend is running at http://localhost:8000"

      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = err.response.data.error
      }

      setError(errorMessage)
      console.error("API Error:", err)

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold">AI Nutrition Assistant</h1>
          <p className="text-xl text-muted-foreground">
            Ask me anything about your nutrition and health goals
          </p>
        </div>

        {/* Chat Messages Container */}
        <Card className="h-[500px] flex flex-col p-6 mb-6 bg-card border border-primary/10">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
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
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

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
        <Card className="p-4 bg-card border border-primary/10">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about nutrition, food recommendations, or your health goals..."
              className="flex-1 bg-background border border-input rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-auto flex-1"
              >
                Send
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send or Shift+Enter for new line
          </p>
        </Card>
      </main>
    </div>
  )
}