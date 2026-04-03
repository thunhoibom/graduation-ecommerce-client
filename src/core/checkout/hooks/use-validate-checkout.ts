'use client';

import { useSearchParams } from 'next/navigation';
import { checkoutApi } from 'src/services/rest-api/app-api/orders/checkout';
import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { CHECKOUT_RECEIPT } from 'src/constants/swr-keys';
import type { ReceiptPojo } from 'src/services/rest-api/app-api/types';

export const useValidateCheckout = () => {
  const searchParams = useSearchParams();

  const transactionData: Record<string, string> = {
    TBK_TOKEN: searchParams.get('TBK_TOKEN') ?? '',
    TBK_ORDEN_COMPRA: searchParams.get('TBK_ORDEN_COMPRA') ?? '',
    TBK_ID_TRANSACCION: searchParams.get('TBK_ID_TRANSACCION') ?? '',
  };

  const isSuccess = !!transactionData.TBK_TOKEN;

  const fetcher = async (): Promise<ReceiptPojo | null> => {
    if (isSuccess) {
      await checkoutApi.validateSuccess({ transactionData }).catch(() => {});
      const receipt = await checkoutApi.fetchReceipt(transactionData.TBK_ID_TRANSACCION || '');
      return receipt.data as ReceiptPojo;
    } else {
      await checkoutApi.validateAborted({ transactionData }).catch(() => {});
      return null;
    }
  };

  const { data, isLoading, error } = useAxiosSWR<ReceiptPojo | null>(
    CHECKOUT_RECEIPT,
    fetcher,
  );

  return {
    receipt: data ?? null,
    isSuccess,
    isLoading,
    error,
  };
};
