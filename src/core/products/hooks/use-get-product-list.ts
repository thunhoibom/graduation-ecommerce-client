import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { productsApi } from 'src/services/rest-api/app-api/products/products';
import {
  FETCH_PRODUCT_LIST,
  FETCH_PRODUCT_BY_CATEGORY,
} from 'src/constants/swr-keys';
import type { DataPage, ProductPojo, TFetchProductParams } from 'src/services/rest-api/app-api/types';

export const useGetProductList = (params?: TFetchProductParams) => {
  const { data, error, isLoading, mutate } = useAxiosSWR<DataPage<ProductPojo>>(
    FETCH_PRODUCT_LIST,
    () => productsApi.fetchList(params ?? {}).then((r) => r.data),
    { revalidateOnMount: true },
  );

  return {
    data,
    list: data?.items ?? [],
    total: data?.totalCount ?? 0,
    error,
    isLoading,
    mutate,
  };
};

export const useGetProductsByCategory = (categoryCode?: string) => {
  const { data, error, isLoading, mutate } = useAxiosSWR<DataPage<ProductPojo>>(
    categoryCode ? FETCH_PRODUCT_BY_CATEGORY : null,
    () => productsApi.fetchList({ categoryCode: categoryCode ?? '' }).then((r) => r.data),
    { revalidateOnMount: true },
  );

  return {
    data,
    list: data?.items ?? [],
    total: data?.totalCount ?? 0,
    error,
    isLoading,
    mutate,
  };
};
