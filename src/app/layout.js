import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CocinaMejor Store - Catálogo",
  description: "Tienda oficial CocinaMejor - productos con stock en tiempo real desde inventario.cocinamejor.store",
};

import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <CartProvider>
          <Navbar />
          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">{children}</main>
          <footer className="border-t bg-white text-center text-xs text-zinc-500 py-4">
            © {new Date().getFullYear()} cocinamejor.store — Fuente de verdad: inventario.cocinamejor.store
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
