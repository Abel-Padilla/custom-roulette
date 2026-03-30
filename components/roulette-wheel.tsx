"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "motion/react"

interface RouletteItem {
  id: string
  name: string
  image: string | null
  color: string
}

interface RouletteWheelProps {
  items: RouletteItem[]
  spinning: boolean
  targetIndex: number | null
  onSpinComplete: () => void
}

const WHEEL_COLORS = [
  "#e63946", "#f4a261", "#2a9d8f", "#264653", 
  "#e76f51", "#f4d35e", "#3d5a80", "#ee6c4d",
  "#588157", "#bc6c25", "#457b9d", "#9d4edd"
]

export function RouletteWheel({ items, spinning, targetIndex, onSpinComplete }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const segmentAngle = 360 / items.length
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, HTMLImageElement>>({})

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loaded: Record<string, HTMLImageElement> = {}
      for (const item of items) {
        if (item.image) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = item.image
          await new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
          loaded[item.id] = img
        }
      }
      setImagesLoaded(loaded)
    }
    loadImages()
  }, [items])

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = canvas.width
    const center = size / 2
    const radius = center - 10

    ctx.clearRect(0, 0, size, size)

    // Draw outer ring
    ctx.beginPath()
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI)
    ctx.strokeStyle = "#FFD700"
    ctx.lineWidth = 6
    ctx.stroke()

    // Draw segments
    items.forEach((item, i) => {
      const startAngle = (i * segmentAngle * Math.PI) / 180
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = item.color || WHEEL_COLORS[i % WHEEL_COLORS.length]
      ctx.fill()
      ctx.strokeStyle = "#1a1a2e"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw image or text
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360)

      const img = imagesLoaded[item.id]
      if (img) {
        const imgSize = 40
        const imgX = radius * 0.6 - imgSize / 2
        const imgY = -imgSize / 2
        ctx.beginPath()
        ctx.arc(imgX + imgSize / 2, 0, imgSize / 2, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(img, imgX, imgY, imgSize, imgSize)
      } else {
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "#fff"
        ctx.font = "bold 14px sans-serif"
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 2
        const displayName = item.name.length > 10 ? item.name.slice(0, 10) + "..." : item.name
        ctx.fillText(displayName, radius * 0.85, 0)
      }

      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(center, center, 25, 0, 2 * Math.PI)
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 25)
    gradient.addColorStop(0, "#FFD700")
    gradient.addColorStop(1, "#FFA500")
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 3
    ctx.stroke()
  }, [items, segmentAngle, imagesLoaded])

  // Handle spin animation
  useEffect(() => {
    if (spinning && targetIndex !== null) {
      // The wheel segments start at 0 degrees (3 o'clock position)
      // The pointer is at the top (-90 degrees / 270 degrees from 0)
      // We need to rotate the wheel so the target segment aligns with the pointer at top
      
      const extraSpins = 5 + Math.random() * 3
      // Calculate where the center of the target segment is
      const segmentCenterAngle = targetIndex * segmentAngle + segmentAngle / 2
      // We need to rotate so that segment ends up at 270 degrees (top of wheel)
      // Since the wheel rotates clockwise with positive values, we calculate:
      // targetRotation = 270 - segmentCenterAngle (to bring segment to top)
      // But we need to add full rotations and normalize
      const targetAngle = 270 - segmentCenterAngle
      const normalizedTarget = ((targetAngle % 360) + 360) % 360
      const currentNormalized = rotation % 360
      
      // Calculate the rotation needed to reach target, plus extra spins
      let rotationNeeded = normalizedTarget - currentNormalized
      if (rotationNeeded <= 0) rotationNeeded += 360
      
      const newRotation = rotation + extraSpins * 360 + rotationNeeded
      
      console.log("[v0] Target index:", targetIndex, "Segment angle:", segmentCenterAngle, "New rotation:", newRotation)
      
      setRotation(newRotation)
    }
  }, [spinning, targetIndex])

  return (
    <div className="relative">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>
      
      {/* Wheel */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: spinning ? 5 : 0,
          ease: [0.32, 0.72, 0.35, 1.0],
        }}
        onAnimationComplete={() => {
          if (spinning) {
            onSpinComplete()
          }
        }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="rounded-full shadow-2xl"
        />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl -z-10" />
    </div>
  )
}
