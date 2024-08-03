"use client";

import { ChartConfig } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { listSales } from "../api/sales/fetcher";
import { getRandomNumber } from "../utils";

export default function useChart() {
  const query = useQuery({ queryKey: ["sales"], queryFn: listSales });

  const monthString = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const data = query.data?.data || [];

  function getSalesYears() {
    if (data.length > 0) {
      const sortedSales = data.sort((a, b) => {
        const dateA = new Date(a.tgl);
        const dateB = new Date(b.tgl);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        return 0;
      });

      const firstYears = new Date(sortedSales[0].tgl).getFullYear();
      const lastYears = new Date(
        sortedSales[sortedSales.length - 1].tgl
      ).getFullYear();

      return {
        first: firstYears,
        last: lastYears,
      };
    }
  }

  function getYearsArray() {
    const date = getSalesYears();

    if (date) {
      const years = Array.from({ length: date.last - date.first + 1 }).map(
        (_, i) => date.first + i
      );

      return years;
    }

    return [];
  }

  function getSalesByYearsAndMonths() {
    const months = Array.from({ length: monthString.length }).map((_, i) => i);
    const years = getYearsArray();

    const dataSets: {
      [months: string]: {
        [years: number]: number;
      };
    } = {};

    years.forEach((year) => {
      months.forEach((month) => {
        const sales = data
          .filter((sale) => {
            const salesDate = new Date(sale.tgl);
            const salesMonth = salesDate.getMonth();
            const salesYears = salesDate.getFullYear();

            return salesMonth === month && salesYears === year;
          })
          .reduce((a, b) => a + b.total_bayar, 0);

        if (dataSets[monthString[month]]) {
          if (!dataSets[monthString[month]][year]) {
            dataSets[monthString[month]][year] = sales;
          } else {
            dataSets[monthString[month]][year] += sales;
          }
        } else {
          dataSets[monthString[month]] = {
            [year]: sales,
          };
        }
      });
    });

    return dataSets;
  }

  const sales = getSalesByYearsAndMonths();

  const salesKeys = Object.keys(sales);

  const chartData = salesKeys.map((key) => ({
    month: key,
    ...sales[key],
  }));

  const chartConfig: {
    [key: string]: {
      label: string;
      color: string;
    };
  } = {} satisfies ChartConfig;

  const years = getYearsArray();

  years.forEach((year) => {
    if (!chartConfig[year]) {
      chartConfig[year] = {
        label: year.toString(),
        color: `hsl(31, 31%, ${getRandomNumber(26, 50)}%)`,
      };
    }
  });

  return {
    data: chartData,
    config: chartConfig,
    years: years,
  };
}
