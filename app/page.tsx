"use client"

import { useState, useEffect } from "react"
import { SetupPanel } from "@/components/setup-panel"
import { GamePanel } from "@/components/game-panel"
import { Leaderboard } from "@/components/leaderboard"
import { PlayerForm } from "@/components/player-form"
import { SparklesText } from "@/components/magicui/sparkles-text"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "motion/react"
import { Settings2, ArrowLeft } from "lucide-react"

interface RouletteItem {
  id: string
  name: string
  image: string | null
  color: string
}

interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

type GamePhase = "setup" | "player" | "playing"

const STORAGE_KEYS = {
  items: "roulette-items",
  leaderboard: "roulette-leaderboard",
}

export default function CasinoRoulette() {
  const [phase, setPhase] = useState<GamePhase>("setup")
  const [items, setItems] = useState<RouletteItem[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [currentScore, setCurrentScore] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEYS.items)
    const savedLeaderboard = localStorage.getItem(STORAGE_KEYS.leaderboard)

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {
        console.error("Failed to parse saved items", e)
      }
    }

    if (savedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(savedLeaderboard))
      } catch (e) {
        console.error("Failed to parse leaderboard", e)
      }
    }

    setIsLoaded(true)
  }, [])

  // Save items to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items))
    }
  }, [items, isLoaded])

  // Save leaderboard to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(leaderboard))
    }
  }, [leaderboard, isLoaded])

  const handleStartGame = () => {
    setPhase("player")
  }

  const handlePlayerSubmit = (name: string) => {
    setPlayerName(name)
    setCurrentScore(0)
    setPhase("playing")
  }

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score)
  }

  const handleGameEnd = () => {
    // Add to leaderboard if score > 0
    if (currentScore > 0) {
      const newEntry: LeaderboardEntry = {
        name: playerName,
        score: currentScore,
        date: new Date().toISOString(),
      }
      setLeaderboard((prev) => [...prev, newEntry])
    }
  }

  const handlePlayAgain = () => {
    setCurrentScore(0)
    setPhase("player")
  }

  const handleBackToSetup = () => {
    setPhase("setup")
    setCurrentScore(0)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="h-dvh bg-background overflow-hidden relative flex flex-col">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-2 md:py-4 flex flex-col h-full min-h-0">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-1 md:mb-3 shrink-0"
        >
          <SparklesText
            className="text-2xl md:text-4xl lg:text-5xl mb-0.5"
            colors={{ first: "#FFD700", second: "#FFA500" }}
          >
            Lucky Roulette
          </SparklesText>
          <p className="text-muted-foreground text-xs md:text-base">
            Predict the winning item and keep your streak alive!
          </p>
        </motion.header>

        {/* Navigation */}
        <AnimatePresence mode="wait">
          {phase !== "setup" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-1 md:mb-2 shrink-0"
            >
              <Button
                variant="ghost"
                onClick={handleBackToSetup}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-4 md:gap-6 flex-1 min-h-0 overflow-auto lg:overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "setup" && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <SetupPanel
                  items={items}
                  onItemsChange={setItems}
                  onStartGame={handleStartGame}
                />
                
                {/* Preview wheel if items exist */}
                {items.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <p className="text-center text-muted-foreground mb-4">Preview</p>
                      <div className="opacity-70 scale-75">
                        <GamePanel
                          items={items}
                          playerName="Preview"
                          currentScore={0}
                          onScoreUpdate={() => {}}
                          onGameEnd={() => {}}
                          onPlayAgain={() => {}}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {phase === "player" && (
              <motion.div
                key="player"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-center py-12"
              >
                <PlayerForm onSubmit={handlePlayerSubmit} />
              </motion.div>
            )}

            {phase === "playing" && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <GamePanel
                  items={items}
                  playerName={playerName}
                  currentScore={currentScore}
                  onScoreUpdate={handleScoreUpdate}
                  onGameEnd={handleGameEnd}
                  onPlayAgain={handlePlayAgain}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar with leaderboard */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Leaderboard entries={leaderboard} />
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
