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
};
