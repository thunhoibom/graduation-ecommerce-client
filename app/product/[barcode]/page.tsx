import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductVariants } from "@/services/rest-api/products/products";
import { Gallery } from "@/components/product/gallery";
import { ProductDescription } from "@/components/product/product-description";
import { Breadcrumb } from "./_components/breadcrumb";
import { ProductReviews } from "./_components/product-reviews";
import { RelatedProducts } from "./_components/related-products";
import { ProductViewBehavior } from "./_components/product-view-behavior";
import type { ProductVariantPojo } from "@/types/product";

interface Props {
  params: Promise<{ barcode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barcode } = await params;
  try {
    const product = await getProduct(barcode);
    return {
      title: `${product.name} — Mono Studio`,
      description: product.description ?? `Mua ${product.name} tại Mono Studio.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0] ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch {
    return { title: "Sản phẩm" };
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

  // Attach variants onto product so ProductDescription can read them
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
      <ProductViewBehavior
        productId={product.id}
        barcode={product.barcode}
        categoryCode={product.category?.code}
      />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 lg:px-6">
        <Breadcrumb
          productName={product.name}
          category={product.category?.name}
          categorySlug={product.category?.code}
        />
      </div>

      {/* Main content — extra bottom padding on mobile for sticky bar */}
      <div className="mx-auto max-w-7xl px-4 pb-32 lg:pb-16 lg:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: sticky gallery */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <Gallery images={images} productName={product.name} variants={variants} />
          </div>

          {/* Right: info + add to cart */}
          <div>
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Below fold */}
        <ProductReviews barcode={barcode} productName={product.name} />
        <RelatedProducts
          categorySlug={product.category?.code}
          currentBarcode={product.barcode}
        />
      </div>
    </>
  );
}
