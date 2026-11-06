import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getAllCatalogProducts, getProductById } from "@/lib/server-api";
import { SHOP_URL } from "@/lib/whatsapp";

export const revalidate = 300;

function getProductImage(product) {
  return product.url_image || product.img || "/logo-cocinamejor.png";
}

function getAbsoluteImage(product) {
  const image = getProductImage(product);
  return image.startsWith("http") ? image : `${SHOP_URL}${image}`;
}

function getProductDescription(product, price) {
  const category = product.category_name ? ` (${product.category_name})` : "";
  const text = `${product.name}${category} desde S/ ${price.toFixed(2)}. Cómpralo en CocinaMejor con stock actualizado y envío a todo el Perú.`;
  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

export async function generateStaticParams() {
  try {
    const products = await getAllCatalogProducts();
    return products.map((product) => ({ id: String(product.id_product) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  let product = null;
  try {
    product = await getProductById(id);
  } catch {}

  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: true },
    };
  }

  const price = Number(product.list_price || product.cost || 0);
  const title = product.name;
  const description = getProductDescription(product, price);
  const image = getAbsoluteImage(product);

  return {
    title,
    description,
    alternates: { canonical: `/producto/${id}` },
    openGraph: {
      type: "website",
      url: `/producto/${id}`,
      title,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductoPage({ params }) {
  const { id } = await params;

  let product = null;
  try {
    product = await getProductById(id);
  } catch {}

  if (!product) notFound();

  const price = Number(product.list_price || product.cost || 0);
  const image = getAbsoluteImage(product);
  const description = getProductDescription(product, price);
  const productUrl = `${SHOP_URL}/producto/${product.id_product}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [image],
    description,
    sku: String(product.id_product),
    ...(product.category_name ? { category: product.category_name } : {}),
    brand: {
      "@type": "Brand",
      name: product.supplier || "CocinaMejor",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PEN",
      price: price.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "CocinaMejor Store",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SHOP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetail product={product} />
    </>
  );
}
