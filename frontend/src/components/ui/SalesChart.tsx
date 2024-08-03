"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useChart from "@/lib/hooks/useChart";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import SmallLoader from "./SmallLoader";

export default function SalesChart() {
  const chart = useChart();

  return (
    <div className="w-full md:max-w-4xl mx-auto min-h-[40svh] border rounded-md p-2">
      {chart.isLoading ? (
        <div className="w-full h-[40svh] grid place-items-center">
          <SmallLoader />
        </div>
      ) : chart.error ? (
        <p className="text-destructive">Gagal memuat data...</p>
      ) : chart.isEmpty ? (
        <div className="w-full h-[40svh] grid place-items-center">
          <p className="text-center text-primary/65 text-xs">
            Belum ada data transaksi...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-1 items-center">
            <Link
              href="/sales"
              className="font-bold text-lg hover:underline hover:underline-offset-4"
            >
              Statistik Transaksi
            </Link>
            <p className="text-sm text-primary/75">
              Berikut merupakan statistik data pendapatan dari seluruh transaksi
            </p>
          </div>
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
        </div>
      )}
    </div>
  );
}
