"use server";

import { ApiEndpoint } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import {
  BarangDto,
  TCreateBarangApiResponse,
  TDeleteBarangApiResponse,
  TGetBarangApiResponse,
  TListBarangApiResponse,
  TUpdateBarangApiResponse,
} from "./definitions";

export async function listBarang(): Promise<TListBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.List);
  const response: TListBarangApiResponse = await res.json();

  return response;
}

export async function createBarang(
  dto: z.infer<typeof BarangDto>
): Promise<TCreateBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.Create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  const response: TCreateBarangApiResponse = await res.json();

  console.log(response);

  if (response.status === 201) {
    revalidatePath("/", "layout");
  }

  return response;
}

export async function getBarang(id: number): Promise<TGetBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.Detail(id));
  const response: TGetBarangApiResponse = await res.json();

  return response;
}

export async function updateBarang(
  id: number,
  dto: z.infer<typeof BarangDto>
): Promise<TUpdateBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.Update(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  const response: TUpdateBarangApiResponse = await res.json();

  if (response.status === 200) {
    revalidatePath("/", "layout");
  }

  return response;
}

export async function deleteBarang(
  id: number
): Promise<TDeleteBarangApiResponse> {
  const res = await fetch(ApiEndpoint.Barang.Delete(id), {
    method: "DELETE",
  });

  const response: TDeleteBarangApiResponse = await res.json();

  if (response.status === 200) {
    revalidatePath("/", "layout");
  }

  return response;
}
