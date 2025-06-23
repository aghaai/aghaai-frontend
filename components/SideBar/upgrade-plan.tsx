import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function UpgradePlan() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle>Upgrade your plan</CardTitle>
        <CardDescription>
          Upgrade to a pro plan to get full access.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Button className="w-full">Upgrade</Button>
      </CardContent>
    </Card>
  )
}
