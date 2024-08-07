import { Api } from "@/constants/Api";
import { TApiResponse } from "@/types/api";
import { BarangDto, TBarang } from "@/types/barang";
import { CustomerDto, TCustomer } from "@/types/customer";
import * as z from "zod";

export async function listBarang(): Promise<TApiResponse<TBarang[]>> {
  const res = await fetch(Api.Barang.List);
  const response: TApiResponse<TBarang[]> = await res.json();

  return response;
}

export async function getBarang(id: number): Promise<TApiResponse<TBarang>> {
  const res = await fetch(Api.Barang.Detail(id));
  const response: TApiResponse<TBarang> = await res.json();

  return response;
}

export async function createBarang(
  dto: z.infer<typeof BarangDto>
): Promise<TApiResponse<TBarang>> {
  const res = await fetch(Api.Barang.Create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  const response: TApiResponse<TBarang> = await res.json();

  return response;
}

export async function updateBarang(
  id: number,
  dto: z.infer<typeof BarangDto>
): Promise<TApiResponse<TBarang>> {
  const res = await fetch(Api.Barang.Update(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  const response: TApiResponse<TBarang> = await res.json();

  return response;
}

export async function deleteBarang(id: number): Promise<TApiResponse<TBarang>> {
  const res = await fetch(Api.Barang.Delete(id), {
    method: "DELETE",
  });
  const response: TApiResponse<TBarang> = await res.json();

  return response;
}

export async function listCustomer(): Promise<TApiResponse<TCustomer[]>> {
  const res = await fetch(Api.Customer.List);
  const response: TApiResponse<TCustomer[]> = await res.json();

  return response;
}

export async function getCustomer(
  id: number
): Promise<TApiResponse<TCustomer>> {
  const res = await fetch(Api.Customer.Detail(id));
  const response: TApiResponse<TCustomer> = await res.json();

  return response;
}

export async function createCustomer(
  dto: z.infer<typeof CustomerDto>
): Promise<TApiResponse<TCustomer>> {
  const res = await fetch(Api.Customer.Create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  const response: TApiResponse<TCustomer> = await res.json();

  return response;
}

export async function updateCustomer(
  id: number,
  dto: z.infer<typeof CustomerDto>
): Promise<TApiResponse<TCustomer>> {
  const res = await fetch(Api.Customer.Update(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  const response: TApiResponse<TCustomer> = await res.json();

  return response;
}

export async function deleteCustomer(
  id: number
): Promise<TApiResponse<TCustomer>> {
  const res = await fetch(Api.Customer.Delete(id), {
    method: "DELETE",
  });
  const response: TApiResponse<TCustomer> = await res.json();

  return response;
}
