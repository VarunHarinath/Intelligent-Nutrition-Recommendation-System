"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onAuthClick?: () => void
}

export default function Header({ onAuthClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            🥗
          </div>
          <span className="hidden sm:inline">NutriSmart</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/ai-chat">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Ask AI
            </Button>
          </Link>

          {/* Existing code */}
          <Button variant="ghost" onClick={onAuthClick} className="text-muted-foreground hover:text-foreground">
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  )
}
