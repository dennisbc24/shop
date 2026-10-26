"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const NOW = Date.now();
const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

export default function ProductCard({ product, stock }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const inCart = cart.some((p) => p.id_product === product.id_product);
  const price = Number(product.list_price || product.cost || 0);
  const referencePrice = Number(product.lowest_price || 0);
  const hasDiscount = referencePrice > price && price > 0;
  const discountPct = hasDiscount ? Math.round(((referencePrice - price) / referencePrice) * 100) : null;
  const isNew = !hasDiscount && product.created && NOW - new Date(product.created).getTime() < NEW_WINDOW_MS;
  const image = product.url_image || product.img || "/window.svg";
  const isOutOfStock = stock !== undefined && Number(stock) <= 0;

  return (
    <article className="product-card">
      <div className="product-image">
        {hasDiscount && discountPct !== null && <span className="discount">-{discountPct}%</span>}
        {isNew && <span className="new">Nuevo</span>}
        <button className="favorite" aria-label="Favorito">♡</button>
        <Link href={`/producto/${product.id_product}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={product.name} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/window.svg"; }} />
        </Link>
      </div>
      <div className="product-info">
        <span className="brand">{product.category_name || "CocinaMejor"}</span>
        <h3><Link href={`/producto/${product.id_product}`}>{product.name}</Link></h3>
        <div className="rating">★★★★★ <span>(0)</span></div>
        <div className="price">
          <strong>S/ {price.toFixed(2)}</strong>
          {hasDiscount && <del>S/ {referencePrice.toFixed(2)}</del>}
        </div>
        <span className="stock">{isOutOfStock ? "● Agotado" : `● En stock${stock !== undefined ? ` (${stock})` : ""}`}</span>
        <button className="add-cart" disabled={isOutOfStock} onClick={() => (inCart ? removeFromCart(product) : addToCart(product))}>
          {isOutOfStock ? "Agotado" : inCart ? "Quitar 🛒" : "Agregar al carrito 🛒"}
        </button>
      </div>
    </article>
  );
}
