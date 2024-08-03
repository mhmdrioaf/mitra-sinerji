"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useChart from "@/lib/hooks/useChart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function SalesChart() {
  const chart = useChart();

  return (
    <ChartContainer
      config={chart.config}
      className="h-[40svh] w-full md:max-w-4xl border rounded-md mx-0 md:mx-auto"
    >
      <BarChart accessibilityLayer data={chart.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        <ChartLegend content={<ChartLegendContent />} />
        {chart.years.map((year) => (
          <Bar
            key={year}
            dataKey={year}
            fill={chart.config[year].color}
            radius={4}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
