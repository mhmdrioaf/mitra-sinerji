"use client";

import { ChartConfig } from "@/components/ui/chart";
import { TSales } from "../api/sales/definitions";
import { getRandomNumber } from "../utils";

export default function useChart({ sales }: { sales: TSales[] }) {
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

  const data = sales;

  function getSalesYears() {
    if (data.length > 0) {
      const first = data.reduce((a, b) => {
        return new Date(a.tgl) < new Date(b.tgl) ? a : b;
      });

      const last = data.reduce((a, b) => {
        return new Date(a.tgl) > new Date(b.tgl) ? a : b;
      });

      return {
        first: new Date(first.tgl).getFullYear(),
        last: new Date(last.tgl).getFullYear(),
      };
    }

    return {
      first: new Date().getFullYear(),
      last: new Date().getFullYear(),
    };
  }

  function getYearsArray() {
    const date = getSalesYears();
    const years = Array.from({ length: date.last - date.first + 1 }).map(
      (_, i) => date.first + i
    );

    return years;
  }

  function getDataSets() {
    const years = getYearsArray();

    const dataSets: {
      [month: string]: {
        [year: number]: number;
      };
    } = {};

    for (const sale of data) {
      const sDate = new Date(sale.tgl);
      const sMonth = sDate.getMonth();
      const sYears = sDate.getFullYear();

      for (let y = 0; y < years.length; y++) {
        const year = years[y];

        for (let m = 0; m < 12; m++) {
          const month = monthString[m];

          const yearsMonthSale =
            sMonth === m && sYears === year ? sale.total_bayar : 0;

          if (!dataSets[month]) {
            dataSets[month] = {
              [year]: yearsMonthSale,
            };
          } else {
            if (dataSets[month][year]) {
              dataSets[month][year] += yearsMonthSale;
            } else {
              dataSets[month][year] = yearsMonthSale;
            }
          }
        }
      }
    }

    return dataSets;
  }

  const chartData = monthString.map((month) => {
    const dataSets = getDataSets();
    if (dataSets[month]) {
      return {
        month,
        ...dataSets[month],
      };
    }
  });

  const getChartConfig = () => {
    const chartConfig: {
      [key: string]: {
        label: string;
        color: string;
      };
    } = {} satisfies ChartConfig;

    const years = getYearsArray();

    for (const year of years) {
      if (!chartConfig[year]) {
        chartConfig[year] = {
          label: year.toString(),
          color: `hsl(31, 31%, ${getRandomNumber(26, 50)}%)`,
        };
      }
    }

    return chartConfig;
  };

  return {
    data: chartData,
    config: getChartConfig(),
    years: getYearsArray(),
    isEmpty: data.length < 1,
  };
}
