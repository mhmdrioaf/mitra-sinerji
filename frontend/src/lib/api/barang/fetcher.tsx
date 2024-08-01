import { ApiEndpoint } from "@/lib/constants";
import { TGetBarangApiResponse, TListBarangApiResponse } from "./definitions";

export async function listBarang(): Promise<TListBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.List);
  const response: TListBarangApiResponse = await res.json();

  return response;
}

export async function getBarang(id: number): Promise<TGetBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.Detail(id));
  const response: TGetBarangApiResponse = await res.json();

  return response;
}
