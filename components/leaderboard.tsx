"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Crown } from "lucide-react"
import { motion } from "motion/react"

interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score).slice(0, 10)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-mono text-sm">{index + 1}</span>
    }
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/10 border-yellow-500/30"
      case 1:
        return "bg-gray-300/10 border-gray-300/30"
      case 2:
        return "bg-amber-600/10 border-amber-600/30"
      default:
        return "bg-secondary/30 border-border"
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No scores yet. Be the first to play!
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {sortedEntries.map((entry, index) => (
              <motion.div
                key={`${entry.name}-${entry.date}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${getRankStyle(index)}
                `}
              >
                <div className="shrink-0">{getRankIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xl font-bold text-primary">{entry.score}</span>
                  <span className="text-xs text-muted-foreground">wins</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
