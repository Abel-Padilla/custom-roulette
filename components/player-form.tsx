"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Play } from "lucide-react"
import { motion } from "motion/react"

interface PlayerFormProps {
  onSubmit: (name: string) => void
}

export function PlayerForm({ onSubmit }: PlayerFormProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card/80 backdrop-blur border-primary/20 w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-primary text-2xl">
            <User className="w-6 h-6" />
            Enter Your Name
          </CardTitle>
          <CardDescription>
            Join the game and compete for the top spot!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border text-lg h-12"
              maxLength={20}
            />
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Playing
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
