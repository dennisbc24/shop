const API_BASE_URL =
  process.env.API_URL_SERVER ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://inventario.cocinamejor.store/api/v1/public";

const API_TOKEN = process.env.API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN;

const rawRevalidate = process.env.CONTENT_REVALIDATE;
export const CONTENT_REVALIDATE =
  rawRevalidate === "false" ? false : Number(rawRevalidate || 300);

async function serverFetch(path, { revalidate = CONTENT_REVALIDATE } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} en ${path}`);
  }

  return res.json();
}

function isOnline(product) {
  return (
    product.is_online === true ||
    product.is_online === 1 ||
    product.is_online === "t" ||
    product.is_online === "true"
  );
}

function hasPrice(product) {
  const price = product.list_price;
  return price !== null && price !== undefined && String(price).trim() !== "" && Number(price) > 0;
}

export function filterCatalogProducts(products) {
  const all = Array.isArray(products) ? products : [];
  const withOnline = all.filter(isOnline);
  const online = withOnline.length > 0 || all.some((p) => p.is_online !== undefined) ? withOnline : all;
  return online.filter(hasPrice);
}

async function fetchProductsPage({ limit = 100, offset = 0, online = true } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (online) params.set("online", "true");
  const data = await serverFetch(`/products?${params.toString()}`);
  return Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
}

export async function getCatalogProducts({ limit = 100, offset = 0 } = {}) {
  return filterCatalogProducts(await fetchProductsPage({ limit, offset }));
}

export async function getAllCatalogProducts({ pageSize = 100, max = 5000 } = {}) {
  const all = [];
  let offset = 0;

  while (offset < max) {
    const page = await fetchProductsPage({ limit: pageSize, offset });
    all.push(...page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  const unique = new Map(all.map((product) => [String(product.id_product), product]));
  return filterCatalogProducts([...unique.values()]);
}

export async function getProductById(id) {
  try {
    const product = await serverFetch(`/products/${encodeURIComponent(id)}`);
    if (product && product.id_product) return product;
  } catch {}

  const all = await getAllCatalogProducts();
  return all.find((product) => String(product.id_product) === String(id)) || null;
}

export async function getCategories() {
  try {
    const data = await serverFetch("/categories?withCounts=true&online=true");
    if (Array.isArray(data)) return data;
  } catch {}

  const products = await getAllCatalogProducts();
  const map = new Map();
  const counts = {};

  products.forEach((product) => {
    if (!product.fk_category || !product.category_name) return;
    const key = product.fk_category;
    counts[key] = (counts[key] || 0) + 1;
    if (!map.has(key)) {
      map.set(key, {
        id_category: product.fk_category,
        name: product.category_name,
        slug: product.category_slug || String(product.fk_category).toLowerCase(),
        product_count: 0,
      });
    }
  });

  return Array.from(map.values())
    .map((category) => ({ ...category, product_count: counts[category.id_category] || 0 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
