"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api, { fetchExistenceByProduct } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

export default function ProductoPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [stockRows, setStockRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart, removeFromCart } = useCart();
  const inCart = cart.some((p) => p.id_product === Number(id) || p.id_product === id);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        const found = (Array.isArray(data) ? data : []).find((p) => String(p.id_product) === String(id));
        if (!found) throw new Error("Producto no encontrado");
        setProduct(found);
        try {
          const stock = await fetchExistenceByProduct(found.id_product);
          setStockRows(Array.isArray(stock) ? stock : []);
        } catch {
          setStockRows([]);
        }
      } catch (e) {
        setError(e.message);
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
  const image = product.url_image || product.img || "https://via.placeholder.com/600x400?text=Sin+imagen";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl p-4 border border-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={product.name} className="w-full h-[400px] object-contain bg-zinc-50 rounded-xl" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Sin+imagen")} />
      </div>
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">← Volver</Link>
        <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
        <p className="text-2xl font-bold text-orange-600 mt-2">S/. {price.toFixed(2)}</p>
        <p className={`text-sm mt-2 ${totalStock === 0 ? "text-red-600" : totalStock < 5 ? "text-amber-600" : "text-green-600"}`}>
          {totalStock === 0 ? "Sin stock" : `Stock total: ${totalStock} unidades`}
        </p>
        <div className="mt-4 space-y-2 text-sm text-zinc-700">
          <p><strong>Costo:</strong> S/. {Number(product.cost || 0).toFixed(2)}</p>
          {product.lowest_price && <p><strong>Precio mínimo:</strong> S/. {Number(product.lowest_price).toFixed(2)}</p>}
          {product.fk_supplier && <p><strong>Proveedor ID:</strong> {product.fk_supplier}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={totalStock === 0}
            onClick={() => (inCart ? removeFromCart(product) : addToCart(product))}
            className={`flex-1 rounded-full py-3 font-medium ${totalStock === 0 ? "bg-zinc-200 text-zinc-500" : inCart ? "bg-red-600 text-white" : "bg-black text-white hover:bg-zinc-800"}`}
          >
            {totalStock === 0 ? "Agotado" : inCart ? "Quitar del carrito" : "Agregar al carrito"}
          </button>
          <Link href="/carrito" className="rounded-full border px-6 py-3 text-sm font-medium bg-white hover:bg-zinc-50">Ver carrito</Link>
        </div>

        {stockRows.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Disponibilidad por sucursal (tiempo real via /existence?product=)</h3>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-100">
                  <tr>
                    <th className="text-left p-2">Sucursal</th>
                    <th className="text-left p-2">Cantidad</th>
                    <th className="text-left p-2">Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRows.map((r) => (
                    <tr key={r.id_existence} className="border-t">
                      <td className="p-2">{r.branch_name}</td>
                      <td className="p-2">{r.amount}</td>
                      <td className="p-2 text-xs text-zinc-500">{r.updated ? new Date(r.updated).toLocaleString("es-PE") : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
