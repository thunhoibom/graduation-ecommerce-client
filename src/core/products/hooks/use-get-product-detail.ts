import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { productsApi } from 'src/services/rest-api/app-api/products/products';
import { FETCH_PRODUCT_DETAIL } from 'src/constants/swr-keys';
import type { ProductPojo } from 'src/services/rest-api/app-api/types';

export const useGetProductDetail = (barcode: string | null) => {
  const { data, error, isLoading, mutate } = useAxiosSWR<ProductPojo>(
    barcode ? FETCH_PRODUCT_DETAIL : null,
    () => productsApi.fetchDetail(barcode as string).then((r) => r.data),
    { revalidateOnMount: true },
  );

  return { data, isLoading, error, mutate };
};
