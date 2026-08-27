export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <span className="eyebrow">ESPECIAL DEL MES</span>
          <h1>Cocina más fácil,<span>vive mejor</span></h1>
          <p>Los mejores productos para equipar tu cocina con calidad y al mejor precio.</p>
          <a href="#catalogo" className="primary-button">Ver ofertas →</a>
        </div>
        <div className="hero-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80" alt="Electrodomésticos para cocina" />
        </div>
      </div>
    </section>
  );
}
