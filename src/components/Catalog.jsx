"use client";
import { useEffect, useMemo, useState } from "react";
import api, { fetchInStock, fetchCategories } from "@/lib/api";
import { useSearch } from "@/context/SearchContext";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 10;

export default function Catalog() {
  const { search: externalSearch } = useSearch();
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(externalSearch);
  const [selectedCat, setSelectedCat] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [prevExternalSearch, setPrevExternalSearch] = useState(externalSearch);

  // Ajuste de estado derivado durante el render (patrón recomendado por React)
  if (externalSearch !== prevExternalSearch) {
    setPrevExternalSearch(externalSearch);
    setQuery(externalSearch);
    setPage(1);
  }

  // scroll al catálogo cuando la búsqueda viene del Header
  useEffect(() => {
    if (!externalSearch.trim()) return;
    const t = setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [externalSearch]);

  useEffect(() => {
    fetchCategories({ withCounts: true, online: true }).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // Solo productos habilitados para online
        const params = { online: true, ...(selectedCat ? { category: selectedCat } : {}) };
        if (query.trim()) params.q = query.trim();
        const [prodRes, stockRes] = await Promise.allSettled([
          api.get("/products", { params: { ...params, limit: 100, offset: 0 } }).then((r) => r.data),
          fetchInStock().catch(() => []),
        ]);
        if (cancelled) return;
        if (prodRes.status === "fulfilled") {
          let all = Array.isArray(prodRes.value) ? prodRes.value : [];
          // Fallback cliente si backend viejo no filtró por category (retorna todos)
          if (selectedCat && all.length > 0) {
            const filteredByCat = all.filter((p) => {
              const slugMatch = p.category_slug && String(p.category_slug).toLowerCase() === String(selectedCat).toLowerCase();
              const idMatch = String(p.fk_category) === String(selectedCat);
              const nameMatch = p.category_name && String(p.category_name).toLowerCase() === String(selectedCat).toLowerCase();
              return slugMatch || idMatch || nameMatch;
            });
            // si el backend no filtró, aplicamos el filtro en cliente
            if (filteredByCat.length > 0 && filteredByCat.length < all.length) {
              const isBackendFiltered = all.every((p) => String(p.fk_category) === String(selectedCat) || String(p.category_slug).toLowerCase() === String(selectedCat).toLowerCase());
              if (!isBackendFiltered) all = filteredByCat;
            } else if (filteredByCat.length === 0 && all.length > 0) {
              all = [];
            }
          }
          // fallback cliente para is_online si backend viejo no filtra
          const withOnline = all.filter((p) => p.is_online === true || p.is_online === 1 || p.is_online === "t");
          const filteredOnline = withOnline.length > 0 || all.some((p) => p.is_online !== undefined) ? withOnline : all;
          const withPrice = filteredOnline.filter((p) => {
            const lp = p.list_price;
            return lp !== null && lp !== undefined && String(lp).trim() !== "" && Number(lp) > 0;
          });
          setProducts(withPrice);
        } else {
          throw prodRes.reason;
        }
        if (stockRes.status === "fulfilled" && Array.isArray(stockRes.value)) {
          const map = {};
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
    const t = setTimeout(load, query ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [selectedCat, query]);

  const filtered = products;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const changeCategory = (val) => {
    setSelectedCat(val);
    setPage(1);
  };
  const changeQuery = (val) => {
    setQuery(val);
    setPage(1);
  };

  if (loading) return <div className="py-12 text-center">Cargando catálogo...</div>;
  if (error)
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 font-medium">No se pudo cargar el catálogo: {error}</p>
        <p className="text-sm text-zinc-500 mt-2">
          Verifica que el backend permita lectura pública en /api/v1/public/products
        </p>
        <p className="text-xs text-zinc-400 mt-2">BaseURL: {api.defaults.baseURL}</p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => changeCategory("")} className={`px-4 py-1.5 rounded-full text-sm border ${selectedCat === "" ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-zinc-300"}`}>
            Todas
          </button>
          {categories.map((c) => {
            // c.slug es estable, c.id_category compat
            const val = c.slug || String(c.id_category);
            const count = c.product_count ?? "";
            const active = String(selectedCat) === String(val) || String(selectedCat) === String(c.id_category);
            return (
              <button
                key={c.id_category}
                onClick={() => changeCategory(val)}
                className={`px-4 py-1.5 rounded-full text-sm border ${active ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-zinc-300"}`}
                title={c.description || c.name}
              >
                {c.name} {count !== "" ? `(${count})` : ""}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <p className="text-sm text-zinc-600">
            {filtered.length} productos{totalPages > 1 ? ` — pág ${safePage}/${totalPages}` : ""} {selectedCat ? ` en "${categories.find((c) => (c.slug || String(c.id_category)) === selectedCat)?.name || selectedCat}"` : ""}
          </p>
          <input
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="border border-zinc-300 rounded-full px-4 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">Sin resultados {selectedCat ? "en esta categoría" : ""}</p>
      ) : (
        <>
          <div className="products-grid">
            {paginated.map((p) => {
              const stock = stockMap[p.name?.toLowerCase().trim()];
              return <ProductCard key={p.id_product} product={p} stock={stock} />;
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button disabled={safePage <= 1} onClick={() => setPage(Math.max(1, safePage - 1))} className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 bg-white">
                ← Anterior
              </button>
              <span className="text-sm text-zinc-600">
                {safePage} / {totalPages}
              </span>
              <button disabled={safePage >= totalPages} onClick={() => setPage(Math.min(totalPages, safePage + 1))} className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 bg-white">
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
