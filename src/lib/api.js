import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://inventario.cocinamejor.store/api/v1/public";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

if (typeof window !== "undefined") {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} else {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const fetchExistenceByProduct = async (productId) => {
  const { data } = await api.get("/existence", { params: { product: productId } });
  return data;
};

export const fetchInStock = async () => {
  const { data } = await api.get("/existence/inStock");
  return data;
};

export const fetchStockLow = async () => {
  const { data } = await api.get("/existence/stockLow");
  return data;
};
