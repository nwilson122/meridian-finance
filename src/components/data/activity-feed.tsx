"use client"

import { formatRelativeTime } from "@/lib/utils"
import type { ActivityItem } from "@/types"
import {
  UserPlus, ShoppingCart, RefreshCcw, TrendingUp, TrendingDown,
  Download, AlertTriangle, Rocket, MessageSquare, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const TYPE_CONFIG: Record<ActivityItem["type"], {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  user_signup: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  purchase: { icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
  refund: { icon: RefreshCcw, color: "text-rose-500", bg: "bg-rose-500/10" },
  plan_upgrade: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  plan_downgrade: { icon: TrendingDown, color: "text-amber-500", bg: "bg-amber-500/10" },
  export: { icon: Download, color: "text-violet-500", bg: "bg-violet-500/10" },
  alert: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
  deploy: { icon: Rocket, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  comment: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
}

interface ActivityFeedProps {
  items: ActivityItem[]
  className?: string
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, i) => {
        const cfg = TYPE_CONFIG[item.type] ?? { icon: Zap, color: "text-muted-foreground", bg: "bg-muted" }
        const Icon = cfg.icon

        return (
          <div
            key={item.id}
            className="flex gap-3 items-start py-2.5 px-1 rounded-lg hover:bg-muted/30 transition-colors group animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5", cfg.bg)}>
              <Icon className={cn("size-3.5", cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5 tabular-nums">
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
