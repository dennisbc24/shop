"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api, { fetchExistenceByProduct, fetchProductById } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import ProductImageZoom from "@/components/ProductImageZoom";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildProductMessage, buildWhatsAppUrl, PAYMENT_METHODS_TEXT } from "@/lib/whatsapp";
import { getAvailableStock } from "@/lib/stock";

export default function ProductoPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [stockRows, setStockRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [contacting, setContacting] = useState(false);
  const [contactError, setContactError] = useState("");
  const { addToCart, cart, removeFromCart } = useCart();
  const inCart = cart.some((p) => String(p.id_product) === String(id));

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const found = await fetchProductById(id);
        if (!found || !found.id_product) throw new Error("Producto no encontrado");
        setProduct(found);
        try {
          const stock = await fetchExistenceByProduct(found.id_product);
          setStockRows(Array.isArray(stock) ? stock : []);
        } catch {
          setStockRows([]);
        }
      } catch (e) {
        try {
          const { data } = await api.get("/products", { params: { limit: 100 } });
          const found = (Array.isArray(data) ? data : []).find((p) => String(p.id_product) === String(id));
          if (found) {
            setProduct(found);
            setError(null);
            return;
          }
        } catch {}
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <p className="py-12 text-center">Cargando producto...</p>;
  if (error)
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-sm underline">Volver al catálogo</Link>
      </div>
    );

  const price = Number(product.list_price || product.cost || 0);
  const totalStock = stockRows.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  const image = product.url_image || product.img || "/window.svg";
  const isAvailable = totalStock > 0;
  const overStock = qty > totalStock;

  const handleWhatsApp = async () => {
    setContactError("");
    setContacting(true);
    const pending = typeof window !== "undefined" ? window.open("", "_blank") : null;
    if (pending) pending.opener = null;

    try {
      const available = await getAvailableStock(product.id_product);
      if (available <= 0) {
        pending?.close();
        setContactError("Este producto está agotado. No podemos iniciar la consulta.");
        return;
      }
      if (qty > available) {
        pending?.close();
        setContactError(`Solo hay ${available} unidad${available === 1 ? "" : "es"} disponible${available === 1 ? "" : "s"}.`);
        return;
      }

      const url = buildWhatsAppUrl(buildProductMessage({ product, price, quantity: qty }));
      if (pending) pending.location.href = url;
      else window.location.href = url;
    } catch {
      pending?.close();
      setContactError("No pudimos verificar el stock. Intenta nuevamente.");
    } finally {
      setContacting(false);
    }
  };

  return (
    <div className="container py-8 grid md:grid-cols-2 gap-8">
      <ProductImageZoom src={image} alt={product.name} />
      <div className="flex flex-col">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">← Volver al catálogo</Link>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight mt-3">{product.name}</h1>
        <div className="flex items-baseline gap-3 mt-3">
          <p className="text-3xl font-extrabold" style={{color:"var(--primary)"}}>S/. {price.toFixed(2)}</p>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isAvailable ? "bg-[#e6f4ea] text-[var(--green)]" : "bg-red-50 text-red-600"}`}>{isAvailable ? "● Disponible" : "● Agotado"}</span>
        </div>
        {product.category_name && <span className="mt-3 inline-flex w-fit bg-zinc-100 border border-[var(--border)] text-xs font-semibold px-3 py-1 rounded-full">{product.category_name}</span>}

        {(() => {
          let attrs = product.attributes;
          if (typeof attrs === 'string') { try { attrs = JSON.parse(attrs); } catch { attrs = {}; } }
          if (!attrs || typeof attrs !== 'object' || !Object.keys(attrs).length) return null;
          return (
            <div className="mt-6">
              <h3 className="text-sm font-bold tracking-wide uppercase text-zinc-500 mb-3">Especificaciones</h3>
              <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
                {Object.entries(attrs).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center px-4 py-3">
                    <span className="text-sm font-bold text-zinc-500 capitalize">{k}</span>
                    <span className="text-sm font-semibold text-[var(--text)] capitalize">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-[var(--border)] rounded-full h-11 overflow-hidden">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-zinc-50 text-lg" aria-label="Menos">−</button>
            <input type="number" min={1} max={totalStock || 999} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 h-11 text-center border-x border-[var(--border)] outline-none text-sm font-bold" />
            <button onClick={() => setQty((q) => q + 1)} disabled={isAvailable && qty >= totalStock} className="w-11 h-11 flex items-center justify-center hover:bg-zinc-50 text-lg disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Más">+</button>
          </div>
          <span className="text-xs text-zinc-500">Cant.</span>
          {overStock && <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">Sobrepasa stock ({totalStock})</span>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={!isAvailable || overStock}
            onClick={() => (inCart ? removeFromCart(product) : addToCart(product, qty))}
            className={`flex-1 max-w-[280px] py-3.5 rounded-xl font-bold text-sm transition ${!isAvailable || overStock ? "bg-zinc-200 text-zinc-500 cursor-not-allowed" : inCart ? "bg-red-600 text-white hover:bg-red-700" : "text-white hover:opacity-90"}`}
            style={!isAvailable || overStock ? {} : inCart ? {} : {background:"var(--primary)"}}
          >
            {!isAvailable ? "Agotado" : overStock ? "Sobrepasa stock" : inCart ? "Quitar del carrito" : "Agregar al carrito  🛒"}
          </button>
          <Link href="/carrito" className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-sm font-bold bg-white hover:bg-zinc-50">Ver carrito</Link>
        </div>

        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={contacting || !isAvailable || overStock}
          className={`mt-4 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition ${
            contacting || !isAvailable || overStock
              ? "cursor-not-allowed bg-zinc-300"
              : "bg-[#25D366] hover:bg-[#1ebe5b]"
          }`}
        >
          <WhatsAppIcon />
          {contacting ? "Verificando stock..." : !isAvailable ? "Sin stock" : overStock ? "Sobrepasa stock" : "Consultar por WhatsApp"}
        </button>
        {contactError && <p className="mt-2 max-w-[320px] text-xs font-semibold text-red-600">{contactError}</p>}
        <p className="mt-2 max-w-[320px] text-xs text-zinc-500">{PAYMENT_METHODS_TEXT}</p>
      </div>
    </div>
  );
}
