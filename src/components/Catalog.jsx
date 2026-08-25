"use client";
import { useEffect, useState, useMemo } from "react";
import api, { fetchInStock, fetchCategories } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const params = selectedCat ? { category: selectedCat } : {};
        const [prodRes, stockRes] = await Promise.allSettled([
          api.get("/products", { params }).then((r) => r.data),
          fetchInStock().catch(() => []),
        ]);
        if (cancelled) return;
        if (prodRes.status === "fulfilled") {
          const all = Array.isArray(prodRes.value) ? prodRes.value : [];
          // solo productos con precio sugerido (list_price) - requisito tienda
          const withPrice = all.filter((p) => {
            const lp = p.list_price;
            return lp !== null && lp !== undefined && String(lp).trim() !== "" && Number(lp) > 0;
          });
          setProducts(withPrice);
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
  }, [selectedCat]);

  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, query]);

  useEffect(() => setPage(1), [query, products, selectedCat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

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
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCat("")} className={`px-4 py-1.5 rounded-full text-sm border ${selectedCat === "" ? "bg-black text-white border-black" : "bg-white border-zinc-300"}`}>
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id_category}
              onClick={() => setSelectedCat(String(c.id_category))}
              className={`px-4 py-1.5 rounded-full text-sm border ${String(selectedCat) === String(c.id_category) ? "bg-black text-white border-black" : "bg-white border-zinc-300"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="text-sm text-zinc-600">
            {filtered.length} productos{totalPages > 1 ? ` — pág ${page}/${totalPages}` : ""}
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="border border-zinc-300 rounded-full px-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">Sin resultados</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((p) => {
              const stock = stockMap[p.name?.toLowerCase().trim()];
              return <ProductCard key={p.id_product} product={p} stock={stock} />;
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 bg-white">
                ← Anterior
              </button>
              <span className="text-sm text-zinc-600">
                {page} / {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 bg-white">
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
