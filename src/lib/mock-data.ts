import { subDays, subMonths, format, subHours, subMinutes } from "date-fns"
import type {
  Transaction,
  User,
  ActivityItem,
  DailyAnalytics,
  PageAnalytics,
  TrafficSource,
  DonutSegment,
} from "@/types"

// ─── Seeded random for reproducibility ────────────────────────────────────────

function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRng(42)
const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min: number, max: number) => Number((rng() * (max - min) + min).toFixed(2))
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)]

// ─── Revenue time series (12 months) ──────────────────────────────────────────

export function generateRevenueData() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const baseRevenue = [228000, 252000, 241000, 267000, 283000, 276000, 294000, 308000, 287000, 315000, 324000, 312000]
  const baseExpenses = [168000, 181000, 174000, 189000, 205000, 198000, 216000, 223000, 207000, 235000, 241000, 229000]
  return months.map((month, i) => ({
    date: month,
    revenue: baseRevenue[i] + rand(-1500, 1500),
    expenses: baseExpenses[i] + rand(-800, 800),
    profit: baseRevenue[i] - baseExpenses[i] + rand(-500, 500),
  }))
}

// ─── Daily analytics (30 days) ────────────────────────────────────────────────

export function generateDailyAnalytics(): DailyAnalytics[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const base = 3200 + i * 180
    return {
      date: format(date, "MMM d"),
      pageViews: base + rand(-400, 600),
      uniqueVisitors: Math.floor((base + rand(-400, 600)) * 0.68),
      sessions: Math.floor((base + rand(-400, 600)) * 0.82),
      bounceRate: randFloat(32, 58),
    }
  })
}

// ─── Donut chart — expenses by category ───────────────────────────────────────

export const REVENUE_BY_CATEGORY: DonutSegment[] = [
  { name: "Salaries", value: 89420, color: "#3b82f6" },
  { name: "Infrastructure", value: 23870, color: "#10b981" },
  { name: "Marketing", value: 14560, color: "#f59e0b" },
  { name: "Office", value: 12940, color: "#8b5cf6" },
  { name: "Contractors", value: 18420, color: "#06b6d4" },
  { name: "Other", value: 6320, color: "#ef4444" },
]

// ─── Transactions ─────────────────────────────────────────────────────────────

const CUSTOMERS = [
  { name: "Tesco PLC", email: "finance@tesco.com" },
  { name: "Sainsbury's", email: "accounts@sainsburys.co.uk" },
  { name: "Marks & Spencer", email: "billing@marksandspencer.com" },
  { name: "John Lewis Partnership", email: "finance@johnlewis.com" },
  { name: "Boots UK Ltd", email: "accounts@boots.co.uk" },
  { name: "Argos Ltd", email: "billing@argos.co.uk" },
  { name: "Next PLC", email: "finance@next.co.uk" },
  { name: "Currys PC World", email: "accounts@currys.co.uk" },
  { name: "Halfords Group", email: "billing@halfords.co.uk" },
  { name: "Costa Coffee Ltd", email: "finance@costa.co.uk" },
  { name: "Pret A Manger", email: "accounts@pret.com" },
  { name: "Greggs PLC", email: "billing@greggs.co.uk" },
  { name: "Deliveroo UK", email: "finance@deliveroo.co.uk" },
  { name: "Just Eat Takeaway", email: "accounts@justeat.co.uk" },
  { name: "Rightmove PLC", email: "billing@rightmove.co.uk" },
]

const DESCRIPTIONS = [
  "Digital Marketing Campaign",
  "Website Development Project",
  "Brand Strategy Consultation",
  "SEO Optimization Services",
  "Social Media Management",
  "E-commerce Platform Setup",
  "Content Creation Package",
  "Analytics & Reporting Setup",
  "Email Marketing Campaign",
  "PPC Campaign Management",
  "UI/UX Design Services",
  "Mobile App Development",
  "IT Support & Maintenance",
  "Cloud Migration Services",
  "Data Analytics Consulting",
]

const CATEGORIES: Transaction["category"][] = [
  "software", "software", "infrastructure", "marketing",
  "design", "consulting", "other",
]
const STATUSES: Transaction["status"][] = [
  "completed", "completed", "completed", "pending", "failed", "refunded",
]
const METHODS: Transaction["method"][] = ["card", "wire", "ach", "card", "card"]

export function generateTransactions(count = 50): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const customer = pick(CUSTOMERS)
    const daysAgo = rand(0, 90)
    const invoiceNumber = 45 + i
    return {
      id: `INV-2026-${String(invoiceNumber).padStart(3, "0")}`,
      date: format(subDays(new Date(), daysAgo), "yyyy-MM-dd"),
      description: pick(DESCRIPTIONS),
      amount: randFloat(2500, 48000),
      status: pick(STATUSES),
      category: pick(CATEGORIES),
      customer: customer.name,
      customerEmail: customer.email,
      method: pick(METHODS),
    }
  })
}

// ─── Users ────────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alex", "Chris", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Blake",
  "Avery", "Cameron", "Sage", "Devon", "Kendall", "Skyler", "Peyton",
  "Harper", "Finley", "Rowan", "Phoenix", "River",
]
const LAST_NAMES = [
  "Chen", "Park", "Williams", "Johnson", "Martinez", "Thompson", "Garcia",
  "Anderson", "Wilson", "Moore", "Taylor", "Jackson", "White", "Harris",
  "Clark", "Lewis", "Robinson", "Walker", "Hall", "Allen",
]
const DOMAINS = ["acme.io", "globex.com", "initech.co", "stark.com", "wayne.co"]
const ROLES: User["role"][] = ["admin", "editor", "viewer", "billing"]
const STATUSES_USER: User["status"][] = ["active", "active", "active", "inactive", "pending"]
const PLANS: User["plan"][] = ["starter", "pro", "pro", "enterprise"]

export function generateUsers(count = 30): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const domain = pick(DOMAINS)
    return {
      id: `USR-${String(1000 + i).padStart(5, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
      role: pick(ROLES),
      status: pick(STATUSES_USER),
      joinedAt: format(subMonths(new Date(), rand(1, 24)), "yyyy-MM-dd"),
      lastSeen: format(subHours(new Date(), rand(0, 168)), "yyyy-MM-dd'T'HH:mm:ss"),
      plan: pick(PLANS),
      revenue: randFloat(500, 48000),
    }
  })
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function generateActivityFeed(count = 12): ActivityItem[] {
  const events: Array<{
    type: ActivityItem["type"]
    title: string
    desc: string
  }> = [
    { type: "purchase", title: "Invoice paid", desc: "Tesco PLC paid £12,450 for INV-2026-089" },
    { type: "alert", title: "Invoice overdue", desc: "INV-2026-076 from Marks & Spencer is 15 days overdue" },
    { type: "purchase", title: "Payment received", desc: "John Lewis Partnership — £28,900 via bank transfer" },
    { type: "export", title: "Expense logged", desc: "Office rent payment: £4,500/month to Workspace Solutions" },
    { type: "alert", title: "Budget alert", desc: "Marketing spend exceeded monthly budget by £2,300" },
    { type: "purchase", title: "Invoice paid", desc: "Sainsbury's paid £8,720 for digital marketing campaign" },
    { type: "deploy", title: "VAT return filed", desc: "Q4 2025 VAT return submitted — £18,420 due" },
    { type: "export", title: "Salary payments", desc: "Monthly payroll processed: £67,840 to 23 employees" },
    { type: "alert", title: "Cash flow warning", desc: "Projected shortfall in April 2026 — £12,000" },
    { type: "purchase", title: "Large payment", desc: "Boots UK Ltd paid £45,200 for e-commerce platform" },
    { type: "comment", title: "Invoice sent", desc: "INV-2026-091 sent to Next PLC — £16,800 due in 30 days" },
    { type: "refund", title: "Credit note issued", desc: "£3,200 credit note to Costa Coffee for project cancellation" },
  ]

  return events.slice(0, count).map((e, i) => ({
    id: `ACT-${i + 1}`,
    type: e.type,
    title: e.title,
    description: e.desc,
    timestamp: format(subMinutes(new Date(), i * 18 + rand(2, 15)), "yyyy-MM-dd'T'HH:mm:ss"),
    user: {
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    },
  }))
}

// ─── Page analytics ──────────────────────────────────────────────────────────

export const PAGE_ANALYTICS: PageAnalytics[] = [
  { path: "/dashboard", title: "Dashboard Overview", views: 24830, uniqueVisitors: 18420, avgDuration: 287, bounceRate: 22.4, change: 12.3 },
  { path: "/analytics", title: "Analytics", views: 18640, uniqueVisitors: 14290, avgDuration: 342, bounceRate: 18.7, change: 28.1 },
  { path: "/settings", title: "Settings", views: 12310, uniqueVisitors: 9840, avgDuration: 198, bounceRate: 31.2, change: -4.3 },
  { path: "/users", title: "User Management", views: 9870, uniqueVisitors: 7620, avgDuration: 412, bounceRate: 15.8, change: 18.9 },
  { path: "/billing", title: "Billing & Plans", views: 7430, uniqueVisitors: 5890, avgDuration: 264, bounceRate: 27.3, change: 6.4 },
  { path: "/reports", title: "Reports", views: 5820, uniqueVisitors: 4710, avgDuration: 518, bounceRate: 11.2, change: 41.7 },
  { path: "/integrations", title: "Integrations", views: 4290, uniqueVisitors: 3480, avgDuration: 334, bounceRate: 24.6, change: 15.2 },
  { path: "/api-keys", title: "API Keys", views: 3140, uniqueVisitors: 2820, avgDuration: 156, bounceRate: 38.9, change: -9.1 },
]

// ─── Traffic sources ──────────────────────────────────────────────────────────

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Organic Search", visitors: 38420, percentage: 42.3, change: 18.4 },
  { source: "Direct", visitors: 21840, percentage: 24.1, change: 7.2 },
  { source: "Referral", visitors: 14290, percentage: 15.7, change: 32.8 },
  { source: "Social Media", visitors: 9870, percentage: 10.9, change: -3.4 },
  { source: "Email Campaign", visitors: 4680, percentage: 5.2, change: 22.1 },
  { source: "Paid Search", visitors: 1760, percentage: 1.9, change: -11.7 },
]

// ─── Top pages by views (bar chart) ──────────────────────────────────────────

export function generateTopPagesBarData() {
  return PAGE_ANALYTICS.slice(0, 6).map((p) => ({
    page: p.title.replace(" Overview", "").replace(" Management", ""),
    views: p.views,
    visitors: p.uniqueVisitors,
  }))
}
