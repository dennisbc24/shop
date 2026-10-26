"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          cocina<span className="text-[var(--primary)]">mejor</span>.store
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-[var(--primary)]">Catálogo</Link>
          <Link href="/carrito" className="relative hover:text-[var(--primary)]">
            Carrito
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-[var(--primary)] text-white text-xs rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>
          <Link href="/checkout" className="bg-[var(--primary)] text-white px-3 py-1.5 rounded-full hover:bg-[var(--primary-dark)]">Checkout</Link>
        </nav>
      </div>
    </header>
  );
}
