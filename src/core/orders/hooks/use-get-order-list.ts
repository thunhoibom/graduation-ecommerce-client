import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { ordersApi } from 'src/services/rest-api/app-api/orders/orders';
import type { DataPage, OrderPojo, TFetchOrderParams } from 'src/services/rest-api/app-api/types';

const ORDER_LIST_KEY = 'orders/list';

export const useGetOrderList = (params?: TFetchOrderParams) => {
  // Build a cache key that includes params so SWR re-fetches on page change
  const key = params
    ? `${ORDER_LIST_KEY}?page=${params.page ?? 1}&limit=${params.limit ?? 10}`
    : ORDER_LIST_KEY;

  const { data, error, isLoading, mutate } = useAxiosSWR<DataPage<OrderPojo>>(
    key,
    () => ordersApi.fetchList(params ?? {}).then((r) => r.data),
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
