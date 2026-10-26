export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51949242995").replace(/\D/g, "");

const rawShopUrl = process.env.NEXT_PUBLIC_SHOP_URL || "https://cocinamejor.store";
export const SHOP_URL = rawShopUrl.replace(/\/+$/, "");

export const PAYMENT_METHODS_TEXT = "Aceptamos Yape, Plin y transferencia. Coordinamos el pago y el QR por WhatsApp.";

export function formatPrice(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductMessage({ product, price, quantity }) {
  return [
    `Hola, estoy interesado en "${product.name.trim()}" (${formatPrice(price)}).`,
    `Cantidad: ${quantity}.`,
    `${SHOP_URL}/producto/${product.id_product}`,
    "",
    "¿Me confirmas stock, el total con envío y cómo pagar con Yape/Plin?",
  ].join("\n");
}

export function buildQuoteMessage({ cart, total, customer }) {
  const lines = [
    "Hola, quiero solicitar una cotización:",
    "",
    ...cart.map((product) => {
      const unitPrice = Number(product.list_price || product.cost || 0);
      return `• ${product.quantity}x ${product.name.trim()} — ${formatPrice(unitPrice * product.quantity)}`;
    }),
    "",
    `Total referencial (sin envío): ${formatPrice(total)}`,
    "",
    `Nombre: ${customer.name.trim()}`,
    `Teléfono: ${customer.phone.trim()}`,
    `Dirección: ${customer.address.trim()}`,
  ];

  if (customer.reference?.trim()) lines.push(`Referencia: ${customer.reference.trim()}`);
  if (customer.notes?.trim()) lines.push(`Notas: ${customer.notes.trim()}`);

  lines.push("", "¿Me confirmas stock, envío y total final? El pago sería por Yape, Plin o transferencia.");

  return lines.join("\n");
}
