import { Sales } from '@prisma/client';

export type TSales = Sales;

export type TListSalesResponse = {
  status: number;
  data: TSales[];
};

export type TGetSalesResponse = {
  status: number;
  data: TSales | null;
};

export type TCreateSalesResponse = {
  status: number;
  data: TSales;
  message: string[];
};
