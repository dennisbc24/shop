import Catalog from "@/components/Catalog";

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Catálogo</h1>
        <p className="text-sm text-zinc-600">Productos en tiempo real desde tu inventario. Precios y stock sincronizados.</p>
      </div>
      <Catalog />
    </div>
  );
}
