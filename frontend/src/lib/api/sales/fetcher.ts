import { ApiEndpoint } from "@/lib/constants";
import { TGetSalesApiResponse, TListSalesApiResponse } from "./definitions";

export async function listSales(): Promise<TListSalesApiResponse> {
  const res = await fetch(ApiEndpoint.Sales.List);
  const response: TListSalesApiResponse = await res.json();

  return response;
}

export async function getSalesById(id: number): Promise<TGetSalesApiResponse> {
  const res = await fetch(ApiEndpoint.Sales.Detail(id), {
    cache: "no-store",
  });
  const response: TGetSalesApiResponse = await res.json();

  return response;
}
