"use client";
import { CirclePlay, Coins, Waypoints } from "lucide-react";
import { ReactCountUpWrapper } from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({
  workflowExecutions,
  phaseExecutions,
  creditsConsumed,
}) {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      <StatsCard
        title="Workflow Executions"
        value={workflowExecutions}
        icon={CirclePlay}
      />
      <StatsCard
        title="Phase Executions"
        value={phaseExecutions}
        icon={Waypoints}
      />
      <StatsCard
        title="Credits Consumed"
        value={creditsConsumed}
        icon={Coins}
      />
    </div>
  );
}

function StatsCard({ title, value, icon: Icon }) {
  return (
    <Card className="relative overflow-hidden h-28">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="opacity-10 text-muted-foreground stroke-primary absolute -bottom-4 -right-8"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
}
