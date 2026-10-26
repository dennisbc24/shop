import Catalog from "@/components/Catalog";
import Hero from "@/components/layout/Hero";
import Benefits from "@/components/layout/Benefits";

const banners = [
  { cls: "orange-banner", eyebrow: "HASTA 30% OFF", title: "En pequeños electrodomésticos", link: "Ver ofertas", icon: "☕" },
  { cls: "light-banner", eyebrow: "NUEVOS PRODUCTOS", title: "Descubre lo último para tu cocina", link: "Ver novedades", icon: "🍲" },
  { cls: "dark-banner", eyebrow: "PAGOS SEGUROS", title: "Tu compra está 100% protegida", link: "", icon: "🔒" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />

      <section className="section" id="categorias">
        <div className="container">
          <div className="section-header">
            <h2>Explora nuestras categorías</h2>
            <a href="#catalogo">Ver todas →</a>
          </div>
          <div className="categories-grid">
            {[
              ["🍳", "Electrodomésticos"],
              ["🍴", "Menaje"],
              ["🍲", "Cocina"],
              ["🧁", "Repostería"],
              ["☕", "Pequeños electrodomésticos"],
              ["🫖", "Cafetería"],
              ["🧴", "Limpieza"],
              ["%", "Ofertas", true],
            ].map(([icon, label, offer]) => (
              <a key={label} href="#catalogo" className="category-card">
                <div className={`category-image ${offer ? "offer-category" : ""}`}>{icon}</div>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section products-section" id="catalogo">
        <div className="container">
          <div className="section-header">
            <h2>Productos destacados</h2>
            <a href="#catalogo">Ver todos →</a>
          </div>
          <Catalog />
        </div>
      </section>

      <section className="section">
        <div className="container banners-grid">
          {banners.map((b) => (
            <article key={b.title} className={`promo-banner ${b.cls}`}>
              <div>
                <span>{b.eyebrow}</span>
                <h3>{b.title}</h3>
                {b.link && <a href="#catalogo">{b.link}</a>}
              </div>
              <div className="promo-product">{b.icon}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2>Las mejores marcas aquí</h2>
          </div>
          <div className="brands">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXWX6f4VjuFhJYkuWZ1VptBy5r-wKr844_Gx8HLEQI6XQZRhInzRvhKVv&s=10" alt="Marca 1" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMCMU4gSKBusJCt7zV_-z7xEsI79aAde7dCoucw-7M-o2oBqUJBU6W-vE&s=10" alt="Marca 2" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRevS2c2Uz3hK6bHQVdwLdSBnxp-P5tSixNBbR33EILMw&s=10" alt="Marca 3" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2I2vLCkw5Bk1YhnFCDmKWVWu_XODbFz1tDdBsaCU7Y5JMxf5Av8xQBpc&s=10" alt="Marca 4" />
            <img src="https://selectopa.com/cdn/shop/collections/SITIO_WEB_5_SELECTO_8f3b70e4-e81f-4a30-a9a4-48370ab8fc9a.png?v=1769020353" alt="Marca 5" />
          </div>
        </div>
      </section>
    </>
  );
}
