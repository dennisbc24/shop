"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { count, total } = useCart();
  const onSearch = (v) => {
    if (typeof window !== "undefined" && window.__shopSetSearch) window.__shopSetSearch(v);
  };
  return (
    <header className="header">
      <div className="container header-main">
        <Link href="/" className="logo">
          <span className="logo-icon">👨‍🍳</span>
          <span>Cocina<span>Mejor</span></span>
        </Link>

        <div className="search-box">
          <input type="search" placeholder="¿Qué producto estás buscando?" aria-label="Buscar productos" onChange={(e) => onSearch?.(e.target.value)} />
          <button aria-label="Buscar">🔍</button>
        </div>

        <div className="header-actions">
          <Link href="#" className="header-action">
            <span className="action-icon">♙</span>
            <div>
              <strong>Mi cuenta</strong>
              <small>Iniciar sesión</small>
            </div>
          </Link>

          <Link href="/carrito" className="header-action cart-action">
            <span className="action-icon">🛒</span>
            <div>
              <strong>Mi carrito</strong>
              <small>S/ {total.toFixed(2)}</small>
            </div>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>

      <nav className="navigation">
        <div className="container navigation-content">
          <button className="categories-button">☰ <span>Todas las categorías</span> →</button>
          <ul className="nav-links">
            <li><Link href="/">Inicio</Link></li>
            <li><a href="#categorias">Electrodomésticos</a></li>
            <li><a href="#catalogo">Menaje</a></li>
            <li><a href="#catalogo">Cocina</a></li>
            <li><a href="#catalogo">Repostería</a></li>
            <li><a href="#">Marcas</a></li>
            <li><a href="#catalogo" className="offers-link">Ofertas</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
