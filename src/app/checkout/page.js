"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { buildOrderMessage, buildWhatsAppUrl, formatPrice, PAYMENT_METHODS_TEXT } from "@/lib/whatsapp";
import { verifyCartStock } from "@/lib/stock";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const initialForm = { name: "", phone: "", address: "", reference: "", notes: "" };

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cart.length) return;

    setError("");
    setSent(false);
    setSubmitting(true);

    const pending = window.open("", "_blank");
    if (pending) pending.opener = null;

    try {
      const { ok, missing } = await verifyCartStock(cart);
      if (!ok) {
        pending?.close();
        const detail = missing
          .map(({ product, available }) => `${product.name} (disponible: ${available})`)
          .join(", ");
        setError(`No hay stock suficiente para: ${detail}. Ajusta tu carrito antes de continuar.`);
        return;
      }

      const url = buildWhatsAppUrl(buildOrderMessage({ cart, total, customer: form }));
      if (pending) pending.location.href = url;
      else window.location.href = url;
      setSent(true);
    } catch {
      pending?.close();
      setError("No pudimos verificar el stock en este momento. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="py-12 text-center">
        <h1 className="text-xl font-bold">Tu carrito está vacío</h1>
        <Link href="/" className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full">Ir al catálogo</Link>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto py-8">
      <Link href="/carrito" className="text-sm text-zinc-500 hover:underline">← Volver al carrito</Link>
      <h1 className="text-2xl font-bold mb-2 mt-3">Confirmar pedido</h1>
      <p className="text-sm text-zinc-600 mb-6">
        Revisamos el stock y te llevamos a WhatsApp para coordinar el pago y la entrega.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Nombre</label>
          <input
            id="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={updateField("name")}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 mt-1 outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Teléfono / WhatsApp</label>
          <input
            id="phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ej. 949 242 995"
            value={form.phone}
            onChange={updateField("phone")}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 mt-1 outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div>
          <label htmlFor="address" className="text-sm font-medium">Dirección de entrega</label>
          <input
            id="address"
            required
            autoComplete="street-address"
            value={form.address}
            onChange={updateField("address")}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 mt-1 outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div>
          <label htmlFor="reference" className="text-sm font-medium">Referencia (opcional)</label>
          <input
            id="reference"
            value={form.reference}
            onChange={updateField("reference")}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 mt-1 outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div>
          <label htmlFor="notes" className="text-sm font-medium">Notas (opcional)</label>
          <textarea
            id="notes"
            rows={2}
            value={form.notes}
            onChange={updateField("notes")}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2 mt-1 resize-none outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          {cart.map((product) => {
            const unitPrice = Number(product.list_price || product.cost || 0);
            return (
              <div key={product.id_product} className="flex justify-between gap-4">
                <span>{product.quantity} × {product.name}</span>
                <span className="whitespace-nowrap">{formatPrice(unitPrice * product.quantity)}</span>
              </div>
            );
          })}
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            Total <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] p-3 text-xs text-zinc-700">
          {PAYMENT_METHODS_TEXT}
        </div>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-bold text-white transition hover:bg-[#1ebe5b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <WhatsAppIcon />
          {submitting ? "Verificando stock..." : "Enviar pedido por WhatsApp"}
        </button>
        <p className="text-xs text-zinc-500 text-center">
          Tu pedido se confirma cuando verifiquemos el pago por WhatsApp. No vaciamos tu carrito automáticamente.
        </p>
        {sent && (
          <p className="text-xs font-semibold text-green-700 text-center">
            Se abrió WhatsApp. Envía el mensaje para coordinar el pago y la entrega.
          </p>
        )}
      </form>
    </div>
  );
}
