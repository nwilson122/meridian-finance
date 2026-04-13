"use client"

import { useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target, AlertTriangle } from "lucide-react"
import { generateRevenueData } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { CHART_HEX } from "@/lib/chart-config"

// ─── Mock Data for P&L ───────────────────────────────────────────────────────

const P_AND_L_SUMMARY = [
  { label: "Total Revenue", value: "£3,418,240", change: 12.4, icon: DollarSign },
  { label: "Total Expenses", value: "£2,547,180", change: 8.9, icon: Calculator },
  { label: "Net Profit", value: "£871,060", change: 24.8, icon: TrendingUp },
  { label: "Profit Margin", value: "25.5%", change: 3.2, icon: Target },
]

const REVENUE_BY_CLIENT = [
  { client: "Tesco PLC", revenue: 485200, change: 18.4 },
  { client: "Sainsbury's", revenue: 423800, change: 12.7 },
  { client: "Marks & Spencer", revenue: 387600, change: -2.1 },
  { client: "John Lewis Partnership", revenue: 342100, change: 28.9 },
  { client: "Boots UK Ltd", revenue: 298500, change: 15.3 },
  { client: "Next PLC", revenue: 267300, change: 7.8 },
  { client: "Argos Ltd", revenue: 234700, change: -5.2 },
  { client: "Currys PC World", revenue: 198400, change: 22.1 },
  { client: "Costa Coffee Ltd", revenue: 167200, change: 31.5 },
  { client: "Rightmove PLC", revenue: 142800, change: 9.6 },
]

const EXPENSE_TRENDS = [
  { category: "Salaries", jan: 68000, feb: 71000, mar: 69000, apr: 73000, may: 75000, jun: 72000, jul: 76000, aug: 78000, sep: 74000, oct: 79000, nov: 81000, dec: 77000 },
  { category: "Infrastructure", jan: 18000, feb: 19000, mar: 17500, apr: 20000, may: 21000, jun: 19500, jul: 22000, aug: 23000, sep: 21500, oct: 24000, nov: 25000, dec: 23500 },
  { category: "Marketing", jan: 12000, feb: 15000, mar: 18000, apr: 22000, may: 19000, jun: 16000, jul: 24000, aug: 26000, sep: 21000, oct: 28000, nov: 30000, dec: 25000 },
  { category: "Office", jan: 8000, feb: 8200, mar: 7800, apr: 8500, may: 8800, jun: 8400, jul: 9000, aug: 9200, sep: 8700, oct: 9500, nov: 9800, dec: 9300 },
]

const BUDGET_VS_ACTUAL = [
  { department: "Sales", budget: 45000, actual: 52000 },
  { department: "Marketing", budget: 38000, actual: 34000 },
  { department: "Development", budget: 62000, actual: 67000 },
  { department: "Operations", budget: 28000, actual: 31000 },
  { department: "HR", budget: 22000, actual: 19000 },
  { department: "Finance", budget: 18000, actual: 21000 },
]

// ─── Profit & Loss Page ──────────────────────────────────────────────────────

export default function ProfitLossPage() {
  const plData = useMemo(() => generateRevenueData(), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit & Loss"
        description="Full-featured financial analysis showing revenue, expenses, and profitability across all entities."
      >
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          Last 12 months
        </Button>
      </PageHeader>

      {/* ── Financial Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {P_AND_L_SUMMARY.map((stat, i) => (
          <Card
            key={stat.label}
            className="border-border/60 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <stat.icon className="size-3.5 text-muted-foreground/50" />
              </div>
              <p className="text-xl font-bold font-mono tabular-nums">{stat.value}</p>
              <p className={cn("text-[11px] mt-1 flex items-center gap-0.5",
                stat.change > 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {stat.change > 0 ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                {Math.abs(stat.change)}% vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── P&L Comparison Chart ── */}
      <Card className="border-border/60 animate-fade-in-up delay-200">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Revenue vs Costs</CardTitle>
              <CardDescription className="text-xs mt-0.5">Monthly comparison over the last 12 months</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500" />
                Expenses
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Profit
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-4 pr-2">
          <AreaChart
            data={plData}
            xKey="date"
            series={[
              { key: "revenue", name: "Revenue", color: CHART_HEX.blue },
              { key: "expenses", name: "Expenses", color: CHART_HEX.rose },
              { key: "profit", name: "Profit", color: CHART_HEX.emerald },
            ]}
            height={320}
            formatY={(v) => `£${(v / 1000).toFixed(0)}K`}
            formatTooltip={(v) => formatCurrency(v)}
            showLegend={false}
          />
        </CardContent>
      </Card>

      {/* ── Revenue by Client + Budget vs Actual ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Client */}
        <Card className="border-border/60 animate-fade-in-up delay-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Revenue by Client</CardTitle>
            <CardDescription className="text-xs">Top 10 clients by annual revenue</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {REVENUE_BY_CLIENT.map((client, i) => (
              <div key={client.client}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground truncate">{client.client}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[11px] font-medium flex items-center gap-0.5",
                      client.change > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {client.change > 0 ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                      {Math.abs(client.change).toFixed(1)}%
                    </span>
                    <span className="text-xs font-mono tabular-nums text-foreground w-20 text-right">
                      £{(client.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{
                      width: `${(client.revenue / REVENUE_BY_CLIENT[0].revenue) * 100}%`,
                      opacity: 0.7 + (i === 0 ? 0.3 : 0),
                    }}
                  />
                </div>
                {i < REVENUE_BY_CLIENT.length - 1 && <Separator className="mt-3 opacity-30" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card className="border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Budget vs Actual</CardTitle>
            <CardDescription className="text-xs">Department spending comparison this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4 pr-2">
            <BarChart
              data={BUDGET_VS_ACTUAL}
              xKey="department"
              series={[
                { key: "budget", name: "Budget", color: CHART_HEX.blue },
                { key: "actual", name: "Actual", color: CHART_HEX.emerald },
              ]}
              height={240}
              formatY={(v) => `£${(v / 1000).toFixed(0)}K`}
              formatTooltip={(v) => formatCurrency(v)}
              showLegend={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
