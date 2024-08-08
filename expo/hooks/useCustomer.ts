import { deleteCustomer, listCustomer } from "@/lib/api";
import { TCustomer } from "@/types/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastAndroid } from "react-native";

export default function useCustomer() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: listCustomer,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      setRefreshing(false);
    },
    onError() {
      setRefreshing(false);
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer"],
    queryFn: listCustomer,
  });

  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [deleting, setIsDeleting] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const dataCustomer = data?.data || [];

  function sortData(data: TCustomer[]) {
    return data.sort((a, b) => (a.kode < b.kode ? -1 : 1));
  }

  function filterData() {
    if (search) {
      const filteredData = dataCustomer.filter(
        (customer) =>
          customer.kode.toLowerCase().includes(search.toLowerCase()) ||
          customer.name.toLowerCase().includes(search.toLowerCase())
      );
      return sortData(filteredData);
    }

    return sortData(dataCustomer);
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
        "Data customer tidak ditemukan",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    const response = await deleteCustomer(idToDelete);

    if (response.status === 200) {
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil menghapus data customer",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      mutation.mutate();
      hideDeleteModal();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan ketika menghapus data customer",
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
