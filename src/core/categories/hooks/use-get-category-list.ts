import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { categoriesApi } from 'src/services/rest-api/app-api/products/categories';
import { FETCH_CATEGORY_LIST } from 'src/constants/swr-keys';
import type { ProductCategoryPojo } from 'src/services/rest-api/app-api/types';

export const useGetCategoryList = () => {
  const { data, error, isLoading, mutate } = useAxiosSWR<ProductCategoryPojo[]>(
    FETCH_CATEGORY_LIST,
    () => categoriesApi.fetchList().then((r: { data: ProductCategoryPojo[] }) => r.data),
    { revalidateOnMount: true },
  );

  const items: ProductCategoryPojo[] = Array.isArray(data) ? data : [];

  return {
    data,
    list: items,
    isLoading,
    error,
    mutate,
  };
};
