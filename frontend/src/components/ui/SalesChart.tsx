"use client";

import { TSales } from "@/lib/api/sales/definitions";
import useChart from "@/lib/hooks/useChart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

interface ISalesChartProps {
  sales: TSales[];
}

export default function SalesChart({ sales }: ISalesChartProps) {
  const chart = useChart({ sales });

  return sales.length > 0 ? (
    <ChartContainer
      config={chart.config}
      className="h-[40svh] w-full md:max-w-4xl rounded-md mx-0 md:mx-auto"
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
  ) : (
    <p className="text-xs text-center text-primary/75">
      Saat ini, data transaksi belum tersedia...
    </p>
  );
}
