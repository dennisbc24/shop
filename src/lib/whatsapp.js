export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51949242995").replace(/\D/g, "");

const rawShopUrl = process.env.NEXT_PUBLIC_SHOP_URL || "https://cocinamejor.store";
export const SHOP_URL = rawShopUrl.replace(/\/+$/, "");

export const PAYMENT_METHODS_TEXT = "Aceptamos Yape, Plin y transferencia. El QR te lo compartimos por WhatsApp.";

export function formatPrice(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductMessage({ product, price, quantity }) {
  return [
    `Hola, estoy interesado en "${product.name}" (${formatPrice(price)}).`,
    `Cantidad: ${quantity}.`,
    `${SHOP_URL}/producto/${product.id_product}`,
    "",
    "¿Me confirmas stock y me compartes el QR de Yape/Plin para pagar?",
  ].join("\n");
}

export function buildOrderMessage({ cart, total, customer }) {
  const lines = [
    "Hola, quiero coordinar este pedido:",
    "",
    ...cart.map((product) => {
      const unitPrice = Number(product.list_price || product.cost || 0);
      return `• ${product.quantity}x ${product.name} — ${formatPrice(unitPrice * product.quantity)}`;
    }),
    "",
    `Total: ${formatPrice(total)}`,
    "",
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Dirección: ${customer.address}`,
  ];

  if (customer.reference?.trim()) lines.push(`Referencia: ${customer.reference.trim()}`);
  if (customer.notes?.trim()) lines.push(`Notas: ${customer.notes.trim()}`);

  lines.push("", "Pago: Yape, Plin o transferencia. ¿Me compartes el QR para pagar?");

  return lines.join("\n");
}
