import { listBarang } from "@/lib/api";
import { TBarang } from "@/types/barang";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useBarang() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: listBarang,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      setRefreshing(false);
    },
    onError() {
      setRefreshing(false);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["barang"],
    queryFn: listBarang,
  });

  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dataBarang = data?.data || [];

  function sortData(data: TBarang[]) {
    return data.sort((a, b) => (a.kode < b.kode ? -1 : 1));
  }

  function filterData() {
    if (search) {
      const filteredData = dataBarang.filter(
        (barang) =>
          barang.kode.toLowerCase().includes(search.toLowerCase()) ||
          barang.nama.toLowerCase().includes(search.toLowerCase())
      );
      return sortData(filteredData);
    }

    return sortData(dataBarang);
  }

  function onSearch(query: string) {
    setSearch(query);
  }

  function onRefresh() {
    setRefreshing(true);
    mutation.mutate();
  }

  return {
    state: {
      data: filterData(),
      loading: isLoading,
      error: error,
      search: search,
      refreshing,
    },
    handler: {
      search: onSearch,
      refresh: onRefresh,
    },
  };
}
