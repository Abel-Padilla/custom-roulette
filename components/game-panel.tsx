"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RouletteWheel } from "./roulette-wheel"
import { useConfetti } from "@/components/magicui/confetti"
import { motion, AnimatePresence } from "motion/react"
import { Trophy, RotateCcw, Target, Sparkles } from "lucide-react"

interface RouletteItem {
  id: string
  name: string
  image: string | null
  color: string
}

interface GamePanelProps {
  items: RouletteItem[]
  playerName: string
  currentScore: number
  onScoreUpdate: (score: number) => void
  onGameEnd: () => void
  onPlayAgain: () => void
}

type GameState = "selecting" | "spinning" | "result"

export function GamePanel({
  items,
  playerName,
  currentScore,
  onScoreUpdate,
  onGameEnd,
  onPlayAgain,
}: GamePanelProps) {
  const [gameState, setGameState] = useState<GameState>("selecting")
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null)
  const [resultItem, setResultItem] = useState<RouletteItem | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const [isWin, setIsWin] = useState<boolean | null>(null)
  const { fireWin } = useConfetti()

  const handleSelectItem = (item: RouletteItem) => {
    if (gameState !== "selecting") return
    setSelectedItem(item)
  }

  const handleSpin = () => {
    if (!selectedItem || gameState !== "selecting") return
    
    // Random result
    const randomIndex = Math.floor(Math.random() * items.length)
    const result = items[randomIndex]
    
    console.log("[v0] Spinning - Target index:", randomIndex, "Result item:", result.name, "Selected:", selectedItem.name)
    
    setTargetIndex(randomIndex)
    setGameState("spinning")
    setResultItem(result)
    setIsWin(result.id === selectedItem.id)
  }

  const handleSpinComplete = () => {
    setGameState("result")
    
    if (isWin) {
      fireWin()
      onScoreUpdate(currentScore + 1)
    } else {
      onGameEnd()
    }
  }

  const handleContinue = () => {
    setSelectedItem(null)
    setResultItem(null)
    setTargetIndex(null)
    setIsWin(null)
    setGameState("selecting")
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Player info */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card/80 backdrop-blur border border-primary/20">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">{playerName}</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-xl font-bold text-primary">{currentScore}</span>
          <span className="text-muted-foreground">wins</span>
        </div>
      </div>

      {/* Roulette wheel */}
      <RouletteWheel
        items={items}
        spinning={gameState === "spinning"}
        targetIndex={targetIndex}
        onSpinComplete={handleSpinComplete}
      />

      {/* Selection area */}
      <AnimatePresence mode="wait">
        {gameState === "selecting" && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Select your prediction:</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`
                        p-3 rounded-lg border-2 transition-all flex items-center gap-2
                        ${selectedItem?.id === item.id
                          ? "border-primary bg-primary/20 scale-105"
                          : "border-border hover:border-primary/50 bg-secondary/30"
                        }
                      `}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleSpin}
                  disabled={!selectedItem}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                  size="lg"
                >
                  Spin the Wheel!
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gameState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className={`
              border-2 backdrop-blur
              ${isWin ? "border-accent bg-accent/10" : "border-destructive bg-destructive/10"}
            `}>
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-6xl"
                >
                  {isWin ? "🎉" : "😢"}
                </motion.div>
                
                <h3 className={`text-2xl font-bold ${isWin ? "text-accent" : "text-destructive"}`}>
                  {isWin ? "You Won!" : "Game Over!"}
                </h3>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    The wheel landed on:
                  </p>
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary/50">
                    {resultItem?.image ? (
                      <img
                        src={resultItem.image}
                        alt={resultItem.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded"
                        style={{ backgroundColor: resultItem?.color }}
                      />
                    )}
                    <span className="text-xl font-bold">{resultItem?.name}</span>
                  </div>
                  {!isWin && (
                    <p className="text-sm text-muted-foreground">
                      You predicted: <span className="font-medium">{selectedItem?.name}</span>
                    </p>
                  )}
                </div>

                {isWin ? (
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                    size="lg"
                  >
                    Continue & Spin Again!
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score: <span className="text-primary font-bold text-2xl">{currentScore}</span>
                    </p>
                    <Button
                      onClick={onPlayAgain}
                      className="w-full"
                      variant="secondary"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
