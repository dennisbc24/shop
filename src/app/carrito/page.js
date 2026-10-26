"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { PAYMENT_METHODS_TEXT } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart();

  if (cart.length === 0)
    return (
      <div className="container py-12 text-center">
        <h1 className="text-xl font-bold">Tu carrito está vacío</h1>
        <Link href="/" className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full">Ir al catálogo</Link>
      </div>
    );

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Carrito ({cart.length})</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.map((p) => {
            const price = Number(p.list_price || p.cost || 0);
            return (
              <div key={p.id_product} className="flex gap-4 bg-white border rounded-2xl p-4 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url_image || "/window.svg"} alt={p.name} className="w-20 h-20 object-cover rounded-xl bg-zinc-100 p-2" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src="/window.svg"}} />
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-1">{p.name}</h3>
                  <p className="text-sm font-bold">S/. {price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(p.id_product, p.quantity - 1)} className="w-8 h-8 rounded-full border">-</button>
                    <span className="w-8 text-center text-sm">{p.quantity}</span>
                    <button onClick={() => updateQty(p.id_product, p.quantity + 1)} className="w-8 h-8 rounded-full border">+</button>
                    <button onClick={() => removeFromCart(p)} className="ml-4 text-xs text-red-600 hover:underline">Quitar</button>
                  </div>
                </div>
                <div className="font-bold">S/. {(price * p.quantity).toFixed(2)}</div>
              </div>
            );
          })}
          <button onClick={clearCart} className="text-sm text-zinc-500 hover:underline">Vaciar carrito</button>
        </div>
        <div className="bg-white border rounded-2xl p-6 h-fit sticky top-20">
          <h3 className="font-bold mb-4">Resumen</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span><span>S/. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span>Envío</span><span className="text-green-600">Gratis</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4">Total<span>S/. {total.toFixed(2)}</span></div>
          <Link href="/checkout" className="mt-6 block text-center bg-black text-white py-3 rounded-full hover:bg-zinc-800">Continuar pedido</Link>
          <p className="text-xs text-zinc-500 mt-2 text-center">{PAYMENT_METHODS_TEXT}</p>
        </div>
      </div>
    </div>
  );
}
