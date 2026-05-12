import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductVariants } from "@/services/rest-api/products/products";
import { Gallery } from "@/components/product/gallery";
import { ProductDescription } from "@/components/product/product-description";
import { Breadcrumb } from "./_components/breadcrumb";
import { ProductReviews } from "./_components/product-reviews";
import { RelatedProducts } from "./_components/related-products";
import { ProductViewBehavior } from "./_components/product-view-behavior";
import { ProductJsonLd } from "./_components/product-json-ld";
import { ForYouRail } from "@/components/product/for-you-rail";
import type { ProductVariantPojo } from "@/types/product";
import { baseUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ barcode: string }>;
}

const META_DESC_MAX = 160;

function truncateMeta(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barcode } = await params;
  const canonical = `${baseUrl.replace(/\/$/, "")}/product/${encodeURIComponent(barcode)}`;

  try {
    const product = await getProduct(barcode);
    const rawDesc =
      product.description?.trim() ||
      (product.category?.name
        ? `${product.name} — ${product.category.name} tại Mono Studio.`
        : `Mua ${product.name} tại Mono Studio.`);
    const description = truncateMeta(rawDesc, META_DESC_MAX);
    const ogImage = product.images?.[0]?.url;

    return {
      title: `${product.name} — Mono Studio`,
      description,
      metadataBase: new URL(baseUrl),
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: product.name,
        description,
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return {
      title: "Sản phẩm",
      metadataBase: new URL(baseUrl),
      alternates: { canonical },
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { barcode } = await params;

  let product;
  try {
    product = await getProduct(barcode);
  } catch {
    notFound();
  }

  if (!product) notFound();

  let variants: ProductVariantPojo[] = [];

  try {
    const variantResult = await getProductVariants({
      productBarcode: barcode,
      pageSize: 100,
    });
    variants = variantResult.items ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product as any).variants = variants;
  } catch {
    // variants are optional
  }

  const images = product.images ?? [];

  return (
    <>
      <ProductJsonLd product={product} variants={variants} />
      <ProductViewBehavior
        productId={product.id}
        barcode={product.barcode}
        categoryCode={product.category?.code}
      />
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-6 lg:px-6">
        <Breadcrumb
          productName={product.name}
          category={product.category?.name}
          categorySlug={product.category?.code}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-32 lg:px-6 lg:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <Gallery
              images={images}
              productName={product.name}
              variants={variants}
              hasDiscount={product.hasDiscount}
              discountPercent={product.discountPercent}
              categoryName={product.category?.name}
            />
          </div>

          <div>
            <ProductDescription product={product} />
          </div>
        </div>

        <ProductReviews barcode={barcode} productName={product.name} />
        <RelatedProducts categorySlug={product.category?.code} currentBarcode={product.barcode} />
        <ForYouRail
          variant="pdp"
          query={product.name}
          excludeIds={product.id != null ? [String(product.id)] : undefined}
        />
      </div>
    </>
  );
}
