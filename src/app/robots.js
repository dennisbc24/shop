import { SHOP_URL } from "@/lib/whatsapp";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/carrito", "/checkout"],
      },
    ],
    sitemap: `${SHOP_URL}/sitemap.xml`,
    host: SHOP_URL,
  };
}
