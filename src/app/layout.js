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

import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { SHOP_URL } from "@/lib/whatsapp";

const SITE_NAME = "CocinaMejor";
const DEFAULT_TITLE = "CocinaMejor Store | Hogar y cocina en Perú";
const DEFAULT_DESCRIPTION =
  "Tienda en línea de electrodomésticos, menaje y artículos de cocina en Perú. Compra por WhatsApp con stock actualizado y envíos a todo el país.";

export const metadata = {
  metadataBase: new URL(SHOP_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME} Store`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "cocina",
    "electrodomésticos",
    "menaje",
    "repostería",
    "utensilios de cocina",
    "tienda de cocina Perú",
    "CocinaMejor",
  ],
  authors: [{ name: SITE_NAME, url: SHOP_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: `${SITE_NAME} Store`,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/logo-cocinamejor.png", width: 420, height: 364, alt: "CocinaMejor Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo-cocinamejor.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: `${SITE_NAME} Store`,
  url: SHOP_URL,
  logo: `${SHOP_URL}/logo-cocinamejor.png`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+51 949 242 995",
      contactType: "customer service",
      areaServed: "PE",
      availableLanguage: ["Spanish"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${SITE_NAME} Store`,
  url: SHOP_URL,
  inLanguage: "es-PE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]).replace(/</g, "\\u003c"),
          }}
        />
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
