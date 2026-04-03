import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { ordersApi } from 'src/services/rest-api/app-api/orders/orders';
import type { OrderPojo } from 'src/services/rest-api/app-api/types';

export const useGetOrderDetail = (buyOrder: string | number | null) => {
  const key = buyOrder != null ? `orders/detail/${buyOrder}` : null;

  const { data, error, isLoading, mutate } = useAxiosSWR<OrderPojo>(
    key,
    () => ordersApi.fetchDetail(buyOrder as string | number).then((r) => r.data),
    { revalidateOnMount: true },
  );

  return { data, isLoading, error, mutate };
};
