"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/charts/stat-card"
import { AreaChart } from "@/components/charts/area-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { DataTable } from "@/components/data/data-table"
import { ActivityFeed } from "@/components/data/activity-feed"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Calendar } from "lucide-react"
import {
  generateRevenueData,
  generateTransactions,
  generateActivityFeed,
  REVENUE_BY_CATEGORY,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import type { StatCard as StatCardType, Transaction } from "@/types"
import { cn } from "@/lib/utils"

// ─── KPI Data ────────────────────────────────────────────────────────────────

const KPI_STATS: StatCardType[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "£284,320",
    rawValue: 284320,
    change: 8.7,
    changeLabel: "from last month",
    icon: "DollarSign",
    trend: "up",
    sparkline: [240000, 252000, 248000, 261000, 275000, 267000, 283000, 294000, 287000, 302000, 298000, 284320],
  },
  {
    id: "profit",
    title: "Net Profit",
    value: "£67,840",
    rawValue: 67840,
    change: 14.2,
    changeLabel: "from last month",
    icon: "TrendingUp",
    trend: "up",
    sparkline: [48000, 52000, 45000, 58000, 62000, 59000, 64000, 69000, 61000, 71000, 68000, 67840],
  },
  {
    id: "invoices",
    title: "Outstanding Invoices",
    value: "£42,180",
    rawValue: 42180,
    change: 12,
    changeLabel: "overdue invoices",
    icon: "FileText",
    trend: "down",
    sparkline: [35000, 38000, 41000, 44000, 39000, 42000, 45000, 43000, 40000, 38000, 41000, 42180],
  },
  {
    id: "runway",
    title: "Cash Runway",
    value: "8.4 months",
    rawValue: 8.4,
    change: -0.6,
    changeLabel: "vs last projection",
    icon: "Calendar",
    trend: "down",
    sparkline: [12.2, 11.8, 10.9, 10.3, 9.8, 9.4, 9.1, 8.8, 8.9, 8.6, 8.7, 8.4],
  },
]

// ─── Transaction table columns ────────────────────────────────────────────────

const STATUS_STYLES: Record<Transaction["status"], { label: string; className: string }> = {
  completed: { label: "Paid", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  failed: { label: "Overdue", className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  refunded: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
}

const txnColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "customer",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground text-xs">{row.original.customer}</div>
        <div className="text-[11px] text-muted-foreground">{row.original.customerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "Invoice #",
    cell: ({ getValue }) => (
      <span className="font-mono font-medium text-xs">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-mono font-medium tabular-nums text-xs">
        £{Number(getValue()).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue() as Transaction["status"]
      const cfg = STATUS_STYLES[s]
      return (
        <Badge variant="outline" className={cn("text-[10px] font-medium h-5 px-1.5 border", cfg.className)}>
          {cfg.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Due Date",
    cell: ({ getValue, row }) => {
      const dueDate = new Date(String(getValue()))
      dueDate.setDate(dueDate.getDate() + 30) // Add 30 days payment terms
      const isOverdue = dueDate < new Date() && row.original.status !== 'completed'
      return (
        <span className={cn("text-xs tabular-nums", isOverdue ? "text-rose-500 font-medium" : "text-muted-foreground")}>
          {formatDate(dueDate.toISOString())}
        </span>
      )
    },
  },
  {
    id: "days_outstanding",
    header: "Days Outstanding",
    cell: ({ row }) => {
      if (row.original.status === 'completed') return <span className="text-xs text-muted-foreground">—</span>
      const dueDate = new Date(row.original.date)
      dueDate.setDate(dueDate.getDate() + 30)
      const today = new Date()
      const daysOutstanding = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const isOverdue = daysOutstanding > 0
      return (
        <span className={cn("text-xs font-medium tabular-nums", isOverdue ? "text-rose-500" : "text-muted-foreground")}>
          {isOverdue ? `${daysOutstanding} days` : '—'}
        </span>
      )
    },
  },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const revenueData = useMemo(() => generateRevenueData(), [])
  const transactions = useMemo(() => generateTransactions(50), [])
  const activityFeed = useMemo(() => generateActivityFeed(10), [])
  const total = REVENUE_BY_CATEGORY.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Overview"
        description="Track revenue, expenses, and cashflow across all entities and projects."
      >
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Calendar className="size-3.5" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </PageHeader>

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} animationDelay={i * 80} />
        ))}
      </div>

      {/* ── Row 2: Area Chart + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Waterfall Chart */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">Cashflow Waterfall</CardTitle>
                <CardDescription className="text-xs mt-0.5">Monthly income vs expenses with running balance over the last 12 months</CardDescription>
              </div>
              <Tabs defaultValue="revenue" className="shrink-0">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="revenue" className="text-[11px] h-6 px-2.5">Revenue</TabsTrigger>
                  <TabsTrigger value="profit" className="text-[11px] h-6 px-2.5">Profit</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4 pr-2">
            <AreaChart
              data={revenueData}
              xKey="date"
              series={[
                { key: "revenue", name: "Revenue" },
                { key: "expenses", name: "Expenses" },
              ]}
              height={260}
              formatY={(v) => `$${(v / 1000).toFixed(0)}K`}
              formatTooltip={(v) => formatCurrency(v)}
            />
          </CardContent>
        </Card>

        {/* Expense Breakdown Donut */}
        <Card className="border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Expense Breakdown</CardTitle>
            <CardDescription className="text-xs">
              {formatCurrency(total, true)} total expenses this month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <DonutChart
              data={REVENUE_BY_CATEGORY}
              height={200}
              innerRadius={65}
              outerRadius={90}
              formatValue={(v) => formatCurrency(v)}
              centerValue={formatCurrency(total, true)}
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Transactions + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Tracker */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Invoice Tracker</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Outstanding invoices with payment status and aging
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={txnColumns}
              data={transactions}
              searchKey="customer"
              searchPlaceholder="Search customers..."
            />
          </CardContent>
        </Card>

        {/* Financial Activity Feed */}
        <Card className="border-border/60 animate-fade-in-up delay-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Financial Activity</CardTitle>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                Live
              </span>
            </div>
            <CardDescription className="text-xs">Recent financial events and alerts</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ActivityFeed items={activityFeed} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
