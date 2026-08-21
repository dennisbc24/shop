import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://inventario.cocinamejor.store/api/v1/public";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor opcional para token público / de servicio si existe
// Si el backend exige JWT para /products, guarda un token de solo-lectura en NEXT_PUBLIC_API_TOKEN
if (typeof window !== "undefined") {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;

// Helpers tipados para fuente de verdad
export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const fetchExistenceByProduct = async (productId) => {
  const { data } = await api.get("/existence", { params: { product: productId } });
  return data; // [{branch_name, amount, product, ...}]
};

export const fetchInStock = async () => {
  const { data } = await api.get("/existence/inStock");
  return data;
};

export const fetchStockLow = async () => {
  const { data } = await api.get("/existence/stockLow");
  return data;
};

export const fetchTopSelling = async () => {
  const { data } = await api.get("/ventas/topSellingProducts");
  return data;
};
