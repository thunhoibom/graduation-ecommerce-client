import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProductVariants } from "@/services/rest-api/products/products";
import { Gallery } from "@/components/product/gallery";
import { ProductDescription } from "@/components/product/product-description";

interface Props {
  params: Promise<{ barcode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barcode } = await params;
  try {
    const product = await getProduct(barcode);
    return {
      title: product.name,
      description: product.description,
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

  // Attach variants directly onto the product object so existing
  // ProductDescription / VariantSelector components can read them via
  // (product as unknown as { variants }).variants
  try {
    const variantResult = await getProductVariants({
      productBarcode: barcode,
      pageSize: 100,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (product as any).variants = variantResult.items;
  } catch {
    // variants are optional — continue without them
  }

  const images = product.images ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Left: Gallery */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <Gallery images={images} productName={product.name} />
        </div>

        {/* Right: Description + Add to cart */}
        <div>
          <ProductDescription product={product} />
        </div>
      </div>
    </div>
  );
}
