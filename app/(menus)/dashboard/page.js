import { Suspense } from "react";
import { ChartColumnStacked, Layers2 } from "lucide-react";
import { getCreditsConsumedStats } from "@/actions/analytics/getCreditsConsumedStats";
import { getPeriods } from "@/actions/analytics/getPeriods";
import { getStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { PeriodSelector } from "./_components/PeriodSelector";
import { StatsCards } from "./_components/StatsCards";
import { ErrorAlert } from "@/components/ErrorAlert";
import { StatsAreaChart } from "@/components/StatsAreaChart";
import { StatsBarChart } from "@/components/StatsBarChart";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage({ searchParams }) {
  const currentDate = new Date();

  let { month, year } = searchParams;
  month = parseInt(month);
  year = parseInt(year);
  if (isNaN(month) || month < 0 || month > 11) month = currentDate.getMonth();
  if (isNaN(year) || year < 0 || year > 9999) year = currentDate.getFullYear();

  const period = { month, year };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<PeriodSelectorWrapperSkeleton />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardsWrapperSkeleton />}>
          <StatsCardsWrapper selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<ExecutionStatsWrapperSkeleton />}>
          <ExecutionStatsWrapper selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<CreditsConsumedStatsWrapperSkeleton />}>
          <CreditsConsumedStatsWrapper selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

function PeriodSelectorWrapperSkeleton() {
  return <Skeleton className="w-[180px] h-10"></Skeleton>;
}

async function PeriodSelectorWrapper({ selectedPeriod }) {
  const periods = await getPeriods().catch((error) => ({
    errorMessage: error.message,
  }));

  if (periods.errorMessage)
    return <ErrorAlert message={periods.errorMessage} />;

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

function StatsCardsWrapperSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

async function StatsCardsWrapper({ selectedPeriod }) {
  const values = await getStatsCardsValues(selectedPeriod).catch((error) => ({
    errorMessage: error.message,
  }));

  if (values.errorMessage) return <ErrorAlert message={values.errorMessage} />;

  return (
    <StatsCards
      workflowExecutions={values.workflowExecutions}
      phaseExecutions={values.phaseExecutions}
      creditsConsumed={values.creditsConsumed}
    />
  );
}

function ExecutionStatsWrapperSkeleton() {
  return <Skeleton className="h-[340px] rounded-xl" />;
}

async function ExecutionStatsWrapper({ selectedPeriod }) {
  const data = await getWorkflowExecutionStats(selectedPeriod).catch(
    (error) => ({
      errorMessage: error.message,
    })
  );

  if (data.errorMessage) return <ErrorAlert message={data.errorMessage} />;

  return (
    <StatsAreaChart
      icon={<Layers2 />}
      title="Workflow Runs Statistics"
      description="A daily breakdown of successful and failed workflow runs."
      chartConfig={{
        success: { label: "Success", color: "hsl(var(--chart-1))" },
        failed: { label: "Failed", color: "hsl(var(--chart-2))" },
      }}
      data={data}
    />
  );
}

function CreditsConsumedStatsWrapperSkeleton() {
  return <Skeleton className="h-[340px] rounded-xl" />;
}

async function CreditsConsumedStatsWrapper({ selectedPeriod }) {
  const data = await getCreditsConsumedStats(selectedPeriod).catch((error) => ({
    errorMessage: error.message,
  }));

  if (data.errorMessage) return <ErrorAlert message={data.errorMessage} />;

  return (
    <StatsBarChart
      icon={<ChartColumnStacked />}
      title="Credits Consumption Statistics"
      description="Daily count of credits used during successful and failed run phases."
      chartConfig={{
        success: {
          label: "Successful Phase Credits",
          color: "hsl(var(--chart-1))",
        },
        failed: { label: "Failed Phase Credits", color: "hsl(var(--chart-2))" },
      }}
      data={data}
    />
  );
}
