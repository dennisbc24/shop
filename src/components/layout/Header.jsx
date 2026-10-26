"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useSearch } from "@/context/SearchContext";

export default function Header() {
  const { count, total } = useCart();
  const { setSearch } = useSearch();
  const [input, setInput] = useState("");
  const doSearch = () => {
    setSearch(input);
    // scroll a resultados más arriba y visible
    setTimeout(() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  return (
    <header className="header">
      <div className="container header-main">
        <Link href="/" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="logo-image" width="54" height="54" />
          <span className="logo-text">
            <span className="logo-name">Cocina<span>Mejor</span></span>
            <span className="logo-tagline">Tienda en línea de hogar y cocina</span>
          </span>
        </Link>

        <div className="search-box">
          <input
            type="search"
            placeholder="¿Qué producto estás buscando?"
            aria-label="Buscar productos"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } }}
          />
          <button aria-label="Buscar" onClick={doSearch}>🔍</button>
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
