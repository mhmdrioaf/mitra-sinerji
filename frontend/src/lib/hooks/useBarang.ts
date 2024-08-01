"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { TBarang, TListBarangApiResponse } from "../api/barang/definitions";
import { listBarang } from "../api/barang/fetcher";

export function useBarang() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: listBarang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
  const {
    data: response,
    error,
    isLoading,
  } = useQuery<TListBarangApiResponse>({
    queryKey: ["barang"],
    queryFn: listBarang,
  });

  const keysBarang: (keyof TBarang)[] = ["id", "kode", "nama", "harga"];

  const [search, setSearch] = React.useState<string>("");
  const [sortOptions, setSortOptions] = React.useState<{
    by: keyof TBarang | null;
    order: "asc" | "desc";
  }>({
    by: null,
    order: "asc",
  });

  function sortData(data: TBarang[], key: keyof TBarang) {
    return data.sort((a, b) => {
      if (sortOptions.order === "asc") {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      } else {
        if (a[key] > b[key]) {
          return -1;
        }
        if (a[key] < b[key]) {
          return 1;
        }
        return 0;
      }
    });
  }

  function sortByKey(option: keyof TBarang) {
    setSortOptions((prev) => ({
      ...prev,
      by: prev.by === option ? null : option,
    }));
  }

  function handleSortOrder() {
    setSortOptions((prev) => ({
      ...prev,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  }

  function filterData() {
    if (response && response.data) {
      if (search) {
        const filteredDataBarang = response.data.filter((barang) =>
          barang.nama.toLowerCase().includes(search.toLowerCase())
        );

        return sortData(filteredDataBarang, sortOptions.by ?? "nama");
      }

      return sortData(response.data, sortOptions.by ?? "kode");
    }
  }

  function handleSort(key: keyof TBarang) {
    setSortOptions((prev) => ({
      by: key,
      order: prev.by === key ? (prev.order === "asc" ? "desc" : "asc") : "asc",
    }));
  }

  const barang = filterData();

  return {
    data: {
      state: {
        barang,
        error,
        isLoading,
      },
      handler: {
        mutation,
        search: setSearch,
      },
    },

    sort: {
      state: {
        keys: keysBarang,
        options: sortOptions,
      },
      handler: {
        sortByKey,
        handleSortOrder,
        sort: handleSort,
      },
    },
  };
}
