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

import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SearchProvider>
            <TopBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
