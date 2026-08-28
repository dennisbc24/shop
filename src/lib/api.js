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

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const fetchCategories = async (opts = {}) => {
  const { withCounts = true, online = true } = opts;
  try {
    const params = {};
    if (withCounts) params.withCounts = true;
    if (online) params.online = true;
    const { data } = await api.get("/categories", { params });
    return data;
  } catch (e) {
    // fallback: si /public/categories da 401 (backend viejo sin deploy), deriva categorías de /products
    if (e?.response?.status === 401 || e?.response?.status === 404) {
      try {
        const { data: prods } = await api.get("/products", { params: { limit: 100 } });
        const map = new Map();
        (Array.isArray(prods) ? prods : []).forEach((p) => {
          if (p.fk_category && p.category_name) {
            const key = p.fk_category;
            if (!map.has(key)) map.set(key, { id_category: p.fk_category, name: p.category_name, slug: p.category_slug || String(p.fk_category).toLowerCase(), product_count: 0 });
          }
        });
        // cuenta si hay slug activo, sino cuenta derivada
        const counts = {};
        (Array.isArray(prods) ? prods : []).forEach((p) => { if (p.fk_category) counts[p.fk_category] = (counts[p.fk_category]||0)+1; });
        return Array.from(map.values()).map((c)=> ({...c, product_count: counts[c.id_category]||0})).sort((a,b)=> a.name.localeCompare(b.name));
      } catch {}
    }
    throw e;
  }
};

export const fetchCategoryBySlug = async (slugOrId) => {
  const { data } = await api.get(`/categories/${slugOrId}`);
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
