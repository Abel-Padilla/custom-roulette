"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, ImagePlus, Dices } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface RouletteItem {
  id: string
  name: string
  image: string | null
  color: string
}

interface SetupPanelProps {
  items: RouletteItem[]
  onItemsChange: (items: RouletteItem[]) => void
  onStartGame: () => void
}

const COLORS = [
  "#e63946", "#f4a261", "#2a9d8f", "#264653",
  "#e76f51", "#f4d35e", "#3d5a80", "#ee6c4d",
  "#588157", "#bc6c25", "#457b9d", "#9d4edd"
]

export function SetupPanel({ items, onItemsChange, onStartGame }: SetupPanelProps) {
  const [newItemName, setNewItemName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const addItem = () => {
    if (!newItemName.trim()) return
    
    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      image: null,
      color: COLORS[items.length % COLORS.length],
    }
    
    onItemsChange([...items, newItem])
    setNewItemName("")
  }

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      onItemsChange(
        items.map((item) =>
          item.id === itemId ? { ...item, image: result } : item
        )
      )
    }
    reader.readAsDataURL(file)
  }

  const triggerImageUpload = (itemId: string) => {
    setSelectedItemId(itemId)
    fileInputRef.current?.click()
  }

  const canStartGame = items.length >= 2

  return (
    <Card className="bg-card/80 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Dices className="w-5 h-5" />
          Setup Roulette Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter prize name..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="bg-background/50 border-border"
          />
          <Button onClick={addItem} size="icon" variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (selectedItemId) {
              handleImageUpload(e, selectedItemId)
            }
          }}
        />

        {/* Items list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                
                {item.image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => triggerImageUpload(item.id)}
                    className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 hover:bg-muted transition-colors border border-dashed border-muted-foreground/30"
                  >
                    <ImagePlus className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}

                <span className="flex-1 font-medium truncate">{item.name}</span>
                <span className="text-muted-foreground text-sm">#{index + 1}</span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length < 2 && (
          <p className="text-sm text-muted-foreground text-center">
            Add at least 2 items to start the game
          </p>
        )}

        {/* Start game button */}
        <Button
          onClick={onStartGame}
          disabled={!canStartGame}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          size="lg"
        >
          Start Game
        </Button>
      </CardContent>
    </Card>
  )
}
