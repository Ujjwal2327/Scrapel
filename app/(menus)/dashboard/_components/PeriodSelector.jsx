"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Months } from "@/lib/constants";
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

  function updatePeriod(month, year) {
    const params = new URLSearchParams(searchParams);
    params.set("month", month);
    params.set("year", year);
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    const paramMonthStr = searchParams.get("month");
    const paramYearStr = searchParams.get("year");
    const paramMonth = parseInt(paramMonthStr);
    const paramYear = parseInt(paramYearStr);
    const isValidPeriod = periods.some(
      ({ month, year }) => month === paramMonth && year === paramYear
    );

    if (!isValidPeriod) {
      const currentDate = new Date();
      updatePeriod(currentDate.getMonth(), currentDate.getFullYear());
    } else if (
      paramMonth != paramMonthStr ||
      paramYear != paramYearStr ||
      paramMonth != selectedPeriod.month ||
      paramYear != selectedPeriod.year
    )
      updatePeriod(selectedPeriod.month, selectedPeriod.year);
  }, []);

  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        updatePeriod(month, year);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {Months[period.month]} {period.year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
