const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

export const ApiEndpoint = {
  Barang: {
    List: API_BASE_URL + "/api/barang",
    Detail: (id: number) => API_BASE_URL + `/api/barang/${id}`,
    Create: API_BASE_URL + "/api/barang",
    Update: (id: number) => API_BASE_URL + `/api/barang/update/${id}`,
    Delete: (id: number) => API_BASE_URL + `/api/barang/delete/${id}`,
  },
  Customer: {
    List: API_BASE_URL + "/api/customer",
    Detail: (id: number) => API_BASE_URL + `/api/customer/${id}`,
    Create: API_BASE_URL + "/api/customer",
    Update: (id: number) => API_BASE_URL + `/api/customer/update/${id}`,
    Delete: (id: number) => API_BASE_URL + `/api/customer/delete/${id}`,
  },
  Sales: {
    List: API_BASE_URL + "/api/sales",
    Detail: (id: number) => API_BASE_URL + "/api/sales/" + id,
    Create: API_BASE_URL + "/api/sales",
  },
};
