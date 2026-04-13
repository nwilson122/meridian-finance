import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export const metadata = { title: "Team Costs" }

export default function TeamCostsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Cost Allocation"
        description="Track employee costs, billable vs non-billable hours, and team profitability."
      />
      <Card className="border-border/60">
        <CardContent>
          <EmptyState
            icon={Users}
            title="Team costs coming soon"
            description="Track who costs what, billable vs non-billable hours, individual profit margins, and team capacity utilization."
          />
        </CardContent>
      </Card>
    </div>
  )
}
