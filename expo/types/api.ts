export type TApiResponse<T> = {
  status: number;
  data: T;
  message?: string[];
};

export enum FormAction {
  Create = "create",
  Update = "update",
}
