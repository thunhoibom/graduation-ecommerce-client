'use client';

import useSWRMutation from 'swr/mutation';
import { checkoutApi } from 'src/services/rest-api/app-api/orders/checkout';
import type { OrderPojo } from 'src/services/rest-api/app-api/types';
import { CHECKOUT_INITIATE } from 'src/constants/swr-keys';

const mutator = (_key: string, { arg }: { arg: OrderPojo }) =>
  checkoutApi.initiate(arg);

export const useInitiateCheckout = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    CHECKOUT_INITIATE,
    mutator,
  );

  return {
    initiate: (order: OrderPojo) => trigger(order),
    isInitiating: isMutating,
    error,
  };
};
