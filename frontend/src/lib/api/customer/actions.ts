"use server";

import { ApiEndpoint } from "@/lib/constants";
import * as z from "zod";
import {
  CustomerDto,
  TCreateCustomerApiResponse,
  TDeleteCustomerApiResponse,
} from "./definitions";

export async function createCustomer(
  dto: z.infer<typeof CustomerDto>
): Promise<TCreateCustomerApiResponse> {
  const res = await fetch(ApiEndpoint.Customer.Create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  const response: TCreateCustomerApiResponse = await res.json();
  return response;
}

export async function updateCustomer(
  id: number,
  dto: z.infer<typeof CustomerDto>
): Promise<TCreateCustomerApiResponse> {
  const res = await fetch(ApiEndpoint.Customer.Update(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  const response: TCreateCustomerApiResponse = await res.json();
  return response;
}

export async function deleteCustomer(
  id: number
): Promise<TDeleteCustomerApiResponse> {
  const res = await fetch(ApiEndpoint.Customer.Delete(id), {
    method: "DELETE",
  });

  const response: TDeleteCustomerApiResponse = await res.json();
  return response;
}
