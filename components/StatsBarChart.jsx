"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export function StatsBarChart({
  icon: Icon,
  title,
  description,
  chartConfig,
  data,
  XAxisDataKey = "date",
  stacked = true,
}) {
  Icon.props.className = "w-6 h-6 text-primary";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          {Icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-52 w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={XAxisDataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                switch (XAxisDataKey) {
                  case "date":
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  default:
                    return value;
                }
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent className="w-56" />} />
            {Object.keys(chartConfig).map((key, index) => {
              const isFirstBar = index === 0;
              const isLastBar = index === Object.keys(chartConfig).length - 1;
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? "key" : key}
                  stroke={`var(--color-${key})`}
                  fill={`var(--color-${key})`}
                  fillOpacity={0.8}
                  radius={
                    !stacked
                      ? [2, 2, 2, 2]
                      : isFirstBar
                      ? [0, 0, 4, 4]
                      : isLastBar
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
