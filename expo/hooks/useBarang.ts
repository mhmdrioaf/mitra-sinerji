import { deleteBarang, listBarang } from "@/lib/api";
import { TBarang } from "@/types/barang";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastAndroid } from "react-native";

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
  const [deleting, setIsDeleting] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

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

  function showDeleteModal(id: number) {
    setIsDeleting(true);
    setIdToDelete(id);
  }

  function hideDeleteModal() {
    setIsDeleting(false);
    setIdToDelete(null);
  }

  async function onDelete() {
    if (!idToDelete) {
      ToastAndroid.showWithGravityAndOffset(
        "Data barang tidak ditemukan",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    const response = await deleteBarang(idToDelete);

    if (response.status === 200) {
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil menghapus data barang",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      mutation.mutate();
      hideDeleteModal();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan ketika menghapus data barang",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  return {
    state: {
      data: filterData(),
      loading: isLoading,
      error: error,
      search: search,
      refreshing,
      deleting,
    },
    handler: {
      search: onSearch,
      refresh: onRefresh,
      delete: onDelete,
      showDeleteModal,
      hideDeleteModal,
    },
  };
}
