"use client";
import { useEffect, useState, useMemo } from "react";
import api, { fetchInStock } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [prodRes, stockRes] = await Promise.allSettled([
          api.get("/products").then((r) => r.data),
          fetchInStock().catch(() => []),
        ]);
        if (cancelled) return;
        if (prodRes.status === "fulfilled") {
          setProducts(prodRes.value || []);
        } else {
          throw prodRes.reason;
        }
        if (stockRes.status === "fulfilled" && Array.isArray(stockRes.value)) {
          const map = {};
          // stockRes: [{product: "Nombre", total_amount: "5", costo:...}]
          stockRes.value.forEach((row) => {
            map[row.product?.toLowerCase().trim()] = Number(row.total_amount);
          });
          setStockMap(map);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e.message || "Error cargando productos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // Poll cada 30s para sincronización casi tiempo real
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, query]);

  if (loading) return <div className="py-12 text-center">Cargando catálogo...</div>;
  if (error)
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 font-medium">No se pudo cargar el catálogo: {error}</p>
        <p className="text-sm text-zinc-500 mt-2">
          Verifica que el backend permita lectura pública en /api/v1/products (ver docs/CORS). Si exige JWT, define NEXT_PUBLIC_API_TOKEN.
        </p>
        <p className="text-xs text-zinc-400 mt-2">BaseURL: {api.defaults.baseURL}</p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
        <p className="text-sm text-zinc-600">{filtered.length} productos</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="border border-zinc-300 rounded-full px-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">Sin resultados</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const stock = stockMap[p.name?.toLowerCase().trim()];
            return <ProductCard key={p.id_product} product={p} stock={stock} />;
          })}
        </div>
      )}
    </div>
  );
}
