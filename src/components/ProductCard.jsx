"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function ProductCard({ product, stock }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const inCart = cart.some((p) => p.id_product === product.id_product);
  const price = Number(product.list_price || product.cost || 0);
  const image = product.url_image || product.img || "/placeholder.png";
  const isOutOfStock = stock !== undefined && Number(stock) <= 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-lg transition">
      <Link href={`/producto/${product.id_product}`} className="block">
        <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Sin+imagen")}
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-2 min-h-[3rem]">{product.name}</h3>
          <p className="text-lg font-bold mt-1">S/. {price.toFixed(2)}</p>
          {stock !== undefined && (
            <p className={`text-xs mt-1 ${isOutOfStock ? "text-red-600" : stock < 5 ? "text-amber-600" : "text-green-600"}`}>
              {isOutOfStock ? "Sin stock" : `Stock: ${stock}`}
            </p>
          )}
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <button
          disabled={isOutOfStock}
          onClick={() => (inCart ? removeFromCart(product) : addToCart(product))}
          className={`w-full rounded-full py-2 text-sm font-medium transition ${
            isOutOfStock
              ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
              : inCart
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-black text-white hover:bg-zinc-800"
          }`}
        >
          {isOutOfStock ? "Agotado" : inCart ? "Quitar del carrito" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
