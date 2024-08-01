"use server";

import { ApiEndpoint } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { SalesDto, TCreateSalesApiResponse } from "./definitions";

export async function createSales(
  dto: z.infer<typeof SalesDto>
): Promise<TCreateSalesApiResponse> {
  const res = await fetch(ApiEndpoint.Sales.Create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  const response: TCreateSalesApiResponse = await res.json();

  if (response.status === 201) {
    revalidatePath("/", "layout");
  }

  return response;
}
