"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  Bell,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
  Command,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | number
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Profit & Loss", href: "/dashboard/analytics", icon: BarChart3 },
      { title: "Activity", href: "/dashboard/activity", icon: Activity },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Team Costs", href: "/dashboard/users", icon: Users },
      { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { title: "Reports", href: "/dashboard/reports", icon: FileText },
      { title: "Alerts", href: "/dashboard/alerts", icon: Bell, badge: 3 },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Integrations", href: "/dashboard/integrations", icon: Zap },
      { title: "Security", href: "/dashboard/security", icon: Shield },
      { title: "Performance", href: "/dashboard/performance", icon: TrendingUp },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 280 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-screen flex-col border-r border-border bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo / Brand */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary shadow-lg shadow-primary/20">
            <Command className="size-4 text-primary-foreground" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="text-sm font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap">
                  Meridian
                </span>
                <span className="ml-1.5 rounded px-1 py-0.5 text-[10px] font-medium bg-primary/15 text-primary">
                  Finance
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.title && !collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.title}
              </p>
            )}
            {group.title && !collapsed && <div className="mb-2" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                const Icon = item.icon

                if (collapsed) {
                  return (
                    <li key={item.href}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex size-10 mx-auto items-center justify-center rounded-lg transition-colors relative",
                              isActive
                                ? "bg-sidebar-accent text-primary"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            <Icon className="size-4 shrink-0" />
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r-full" />
                            )}
                            {item.badge && (
                              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  )
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors relative",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r-full" />
                      )}
                      <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto h-4 px-1.5 text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
            {gi < NAV_GROUPS.length - 1 && !collapsed && (
              <Separator className="mt-4 opacity-30" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2 shrink-0">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2 px-1")}>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-sidebar-foreground">Sarah Williams</p>
              <p className="truncate text-[10px] text-muted-foreground">sarah@meridian.finance</p>
            </div>
          )}
          <div className="size-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            SW
          </div>
        </div>
      </div>

      {/* Collapse toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggle}
        className="absolute -right-3 top-[58px] size-6 rounded-full border bg-background shadow-md z-10 text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </Button>
    </motion.aside>
  )
}
