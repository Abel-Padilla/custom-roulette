"use client"

import confetti from "canvas-confetti"
import { useCallback } from "react"

interface ConfettiOptions {
  particleCount?: number
  angle?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  ticks?: number
  origin?: { x: number; y: number }
  colors?: string[]
  shapes?: confetti.Shape[]
  scalar?: number
  zIndex?: number
}

export const useConfetti = () => {
  const fire = useCallback((options: ConfettiOptions = {}) => {
    confetti({
      particleCount: options.particleCount ?? 100,
      angle: options.angle ?? 90,
      spread: options.spread ?? 70,
      startVelocity: options.startVelocity ?? 45,
      decay: options.decay ?? 0.9,
      gravity: options.gravity ?? 1,
      drift: options.drift ?? 0,
      ticks: options.ticks ?? 200,
      origin: options.origin ?? { x: 0.5, y: 0.5 },
      colors: options.colors ?? ["#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4", "#45B7D1"],
      shapes: options.shapes ?? ["square", "circle"],
      scalar: options.scalar ?? 1,
      zIndex: options.zIndex ?? 100,
    })
  }, [])

  const fireWin = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6B6B"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#4ECDC4", "#45B7D1", "#96CEB4"],
      })
    }, 250)
  }, [])

  return { fire, fireWin }
}
