import { fetchExistenceByProduct } from "@/lib/api";

export function sumStock(rows) {
  if (!Array.isArray(rows)) return 0;
  return rows.reduce((acc, row) => acc + Number(row.amount || 0), 0);
}

export async function getAvailableStock(productId) {
  return sumStock(await fetchExistenceByProduct(productId));
}

export async function verifyCartStock(cart) {
  const checks = await Promise.all(
    cart.map(async (product) => ({
      product,
      available: await getAvailableStock(product.id_product),
    }))
  );

  const missing = checks.filter(({ product, available }) => Number(product.quantity) > available);

  return { ok: missing.length === 0, missing };
}
