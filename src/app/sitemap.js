import { getAllCatalogProducts } from "@/lib/server-api";
import { SHOP_URL } from "@/lib/whatsapp";

export const revalidate = 3600;

export default async function sitemap() {
  let products = [];
  try {
    products = await getAllCatalogProducts();
  } catch {}

  const now = new Date();

  return [
    {
      url: SHOP_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${SHOP_URL}/producto/${product.id_product}`,
      lastModified: product.updated ? new Date(product.updated) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
