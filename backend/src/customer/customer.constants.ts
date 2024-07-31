import { Customer } from '@prisma/client';

export type TListCustomerResponse = {
  status: number;
  data: Customer[];
};

export type TGetCustomerResponse = {
  status: number;
  data: Customer | null;
};

export type TCreateCustomerResponse = {
  status: number;
  message?: string[];
  data: Customer | null;
};

export type TDeleteCustomerResponse = {
  status: number;
  message: string[];
};
