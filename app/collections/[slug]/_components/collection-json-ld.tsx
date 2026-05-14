import type { Collection } from "@/types/collection";
import type { ProductListItem } from "@/types/product";
import { getSiteUrl } from "@/lib/site-url";

interface Props {
  collection: Collection;
  products: ProductListItem[];
  totalCount: number;
}

export function CollectionJsonLd({ collection, products, totalCount }: Props) {
  const origin = getSiteUrl();
  const collectionPath = `/collections/${collection.code}`;

  const crumbs = [
    { "@type": "ListItem" as const, position: 1, name: "Trang chủ", item: `${origin}/` },
    {
      "@type": "ListItem" as const,
      position: 2,
      name: "Tất cả sản phẩm",
      item: `${origin}/collections/all`,
    },
    {
      "@type": "ListItem" as const,
      position: 3,
      name: collection.name,
      item: `${origin}${collectionPath}`,
    },
  ];

  const itemListElement = products.slice(0, 24).map((p, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    item: `${origin}/product/${encodeURIComponent(p.barcode)}`,
    name: p.name,
  }));

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: collection.name,
      numberOfItems: totalCount,
      itemListElement,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
