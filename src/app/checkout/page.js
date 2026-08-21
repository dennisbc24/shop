"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy: no llama a /existence ni /ventas, solo simula
    setDone(true);
    clearCart();
  };

  if (done)
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold text-green-600">¡Pedido recibido! (dummy)</h1>
        <p className="text-sm text-zinc-600 mt-2">Gracias {form.name}. No se descontó stock real. Integra luego con /api/v1/ventas o pasarela.</p>
        <Link href="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-full">Volver al catálogo</Link>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="py-12 text-center">
        <p>Carrito vacío</p><Link href="/" className="underline text-sm">Ir al catálogo</Link>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Checkout dummy</h1>
      <p className="text-sm text-zinc-600 mb-6">Formulario sin pago real. Total: <span className="font-bold">S/. {total.toFixed(2)}</span></p>
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-xl px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-xl px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Dirección</label>
          <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded-xl px-3 py-2 mt-1" />
        </div>
        <div className="border-t pt-4 space-y-2 text-sm">
          {cart.map((p) => (
            <div key={p.id_product} className="flex justify-between"><span>{p.name} × {p.quantity}</span><span>S/. {(Number(p.list_price || p.cost) * p.quantity).toFixed(2)}</span></div>
          ))}
          <div className="flex justify-between font-bold text-base pt-2 border-t">Total <span>S/. {total.toFixed(2)}</span></div>
        </div>
        <button type="submit" className="w-full bg-black text-white py-3 rounded-full hover:bg-zinc-800">Confirmar pedido dummy</button>
        <p className="text-xs text-zinc-500 text-center">No se llama a /ventas ni descuenta inventario. Para real: POST /existence/vendings + /ventas</p>
      </form>
    </div>
  );
}
