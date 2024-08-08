import { listSales } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function useSales() {
  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales"],
    queryFn: listSales,
  });
  const mutation = useMutation({
    mutationFn: listSales,
    onSuccess() {
      setRefreshing(false);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError() {
      setRefreshing(false);
    },
  });

  function onRefresh() {
    setRefreshing(true);
    mutation.mutate();
  }

  return {
    state: {
      data: data?.data || [],
      loading: isLoading,
      error: error,
      refreshing: refreshing,
    },
    handler: {
      refresh: onRefresh,
    },
  };
}
