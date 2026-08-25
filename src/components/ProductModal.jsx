"use client";
import { IMAGE_KEYS } from "./constants";

const prettify = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const isMoney = (key) => /costo|valor|total|ganancia|venta|ingreso|price|p_unit|p_total|revenue|list_price|cost/i.test(key);

// Reutilizado de inventory/frontend/src/components/form/productModal.jsx
export default function ProductModal({ product, onClose }) {
  const imageUrl = product.url_image || product.img || null;
  const name = product.name || product.product || "Detalle del producto";
  const fields = Object.entries(product).filter(([key]) => !IMAGE_KEYS.includes(key));

  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 bg-zinc-100 rounded-full w-8 h-8">×</button>
        <h3 className="font-bold text-lg pr-8">{name}</h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl || "/window.svg"} alt={name} className="w-full h-64 object-contain my-4 bg-zinc-50 rounded-xl" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/window.svg"; }} />
        <div className="space-y-2">
          {fields.map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm border-b border-zinc-100 py-1">
              <strong>{prettify(key)}:</strong>
              <span>{isMoney(key) && value !== "" && value != null ? `S/. ${value}` : String(value ?? "")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
