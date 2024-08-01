import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  TCustomer,
  TListCustomerApiResponse,
} from "../api/customer/definitions";
import { listCustomer } from "../api/customer/fetcher";

export type TCustomerHook = {
  customer: {
    data: TCustomer[];
    isLoading: boolean;
    error: Error | null;
    currentSort: TCustomerSortOptions;
  };
  handler: {
    sort: (key: keyof TCustomer) => void;
    mutate: () => void;
    search: (value: string) => void;
  };
};

export type TCustomerSortOptions = {
  by: keyof TCustomer;
  order: "asc" | "desc";
};

export default function useCustomer(): TCustomerHook {
  const queryClient = useQueryClient();

  const [sortOptions, setSortOptions] = React.useState<TCustomerSortOptions>({
    by: "kode",
    order: "asc",
  });
  const [search, setSearch] = React.useState<string>("");

  const { data, error, isLoading } = useQuery<TListCustomerApiResponse>({
    queryKey: ["customer"],
    queryFn: listCustomer,
  });

  const mutation = useMutation({
    mutationFn: listCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  function sortData() {
    if (data) {
      let result = data.data;
      if (search) {
        result = result.filter((item) => {
          return (
            item.kode.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.telp.toLowerCase().includes(search.toLowerCase())
          );
        });
      }
      if (result.length > 0) {
        return result.sort((a, b) => {
          if (sortOptions.order === "asc") {
            if (a[sortOptions.by] < b[sortOptions.by]) {
              return -1;
            }
            if (a[sortOptions.by] > b[sortOptions.by]) {
              return 1;
            }
            return 0;
          } else {
            if (a[sortOptions.by] > b[sortOptions.by]) {
              return -1;
            }
            if (a[sortOptions.by] < b[sortOptions.by]) {
              return 1;
            }
            return 0;
          }
        });
      }
    }

    return [];
  }

  function handleSort(key: keyof TCustomer) {
    setSortOptions((prev) => ({
      by: prev.by === key ? prev.by : key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  }

  function mutate() {
    mutation.mutate();
  }

  const customers = sortData();

  return {
    customer: {
      data: customers,
      isLoading,
      error: error,
      currentSort: sortOptions,
    },

    handler: {
      sort: handleSort,
      mutate: mutate,
      search: setSearch,
    },
  };
}
