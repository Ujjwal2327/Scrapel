"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { MONTH_NAMES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PeriodSelector({ periods, selectedPeriod }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {MONTH_NAMES[period.month]} {period.year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
