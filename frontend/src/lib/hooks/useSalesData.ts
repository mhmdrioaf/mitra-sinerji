"use client";

import { format } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
import { TSales } from "../api/sales/definitions";

export type TSalesDataHook = {
  state: {
    data: TSales[];
    currentSort: TSalesSortOptions;
    dates: DateRange | undefined;
    grandTotal: number;
  };

  handler: {
    calculateTotalBarang: (sale: TSales) => number;
    formatCurrency: (raw: number) => string;
    sort: (by: keyof TSales) => void;
    search: (data: string) => void;
    changeDate: (dates: DateRange | undefined) => void;
  };
};

export type TSalesSortOptions = {
  by: keyof TSales;
  order: "asc" | "desc";
};

export default function useSalesData({
  salesData,
}: {
  salesData: TSales[];
}): TSalesDataHook {
  const [search, setSearch] = React.useState<string>("");
  const [sortOptions, setSortOptions] = React.useState<TSalesSortOptions>({
    by: "kode",
    order: "asc",
  });
  const [dates, setDates] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  function calculateTotalBarang(sale: TSales) {
    return sale.sales_detail.map((item) => item.barang).length;
  }

  function formatCurrency(raw: number) {
    if (raw === 0) {
      return "-";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(raw);
  }

  function filteredData() {
    const sortedData = salesData.sort((a, b) => {
      if (sortOptions.order === "asc") {
        if (sortOptions.by === "cust") {
          return a.cust.name > b.cust.name ? 1 : -1;
        }
        if (sortOptions.by === "sales_detail") {
          return a.sales_detail.length > b.sales_detail.length ? 1 : -1;
        }
        return a[sortOptions.by] > b[sortOptions.by] ? 1 : -1;
      } else {
        if (sortOptions.by === "cust") {
          return a.cust.name < b.cust.name ? 1 : -1;
        }
        if (sortOptions.by === "sales_detail") {
          return a.sales_detail.length < b.sales_detail.length ? 1 : -1;
        }
        return a[sortOptions.by] < b[sortOptions.by] ? 1 : -1;
      }
    });
    return sortedData.filter((sale) => {
      if (dates && dates.from && dates.to) {
        const salesDate = new Date(sale.tgl);
        const from = new Date(format(dates.from, "y-MM-dd"));
        const to = new Date(format(dates.to, "y-MM-dd"));
        return (
          salesDate >= from &&
          salesDate <= to &&
          (sale.kode.toLowerCase().includes(search.toLowerCase()) ||
            sale.cust.name.toLowerCase().includes(search.toLowerCase()))
        );
      }

      return (
        sale.kode.toLowerCase().includes(search.toLowerCase()) ||
        sale.cust.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  function onSort(by: keyof TSales) {
    if (sortOptions.by === by) {
      setSortOptions({
        by,
        order: sortOptions.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortOptions({
        by,
        order: "asc",
      });
    }
  }

  function onSearch(data: string) {
    setSearch(data);
  }

  function onDateChange(dates: DateRange | undefined) {
    setDates(dates);
  }

  function calculateGrandTotal() {
    const sales = filteredData();
    return sales.reduce((acc, curr) => acc + curr.total_bayar, 0);
  }

  return {
    state: {
      data: filteredData(),
      currentSort: sortOptions,
      dates,
      grandTotal: calculateGrandTotal(),
    },
    handler: {
      calculateTotalBarang,
      formatCurrency,
      sort: onSort,
      search: onSearch,
      changeDate: onDateChange,
    },
  };
}
