import { ApiEndpoint } from "@/lib/constants";
import {
  TGetCustomerApiResponse,
  TListCustomerApiResponse,
} from "./definitions";

export async function listCustomer(): Promise<TListCustomerApiResponse> {
  const res = await fetch(ApiEndpoint.Customer.List);
  const response: TListCustomerApiResponse = await res.json();
  return response;
}

export async function getCustomer(
  id: number
): Promise<TGetCustomerApiResponse> {
  const res = await fetch(ApiEndpoint.Customer.Detail(id));
  const response: TGetCustomerApiResponse = await res.json();
  return response;
}
