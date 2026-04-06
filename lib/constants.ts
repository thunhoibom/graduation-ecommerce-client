export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "CREATED_AT" | "PRICE" | "NAME";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Mới nhất",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Giá: Thấp đến cao",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "Giá: Cao đến thấp",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
  {
    title: "Tên: A-Z",
    slug: "name-asc",
    sortKey: "NAME",
    reverse: false,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;