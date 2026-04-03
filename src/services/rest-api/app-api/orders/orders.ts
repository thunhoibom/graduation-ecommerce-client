import {
  BaseJSONResponse,
  BillingTypePojo,
  DataPage,
  OrderPojo,
  PaymentRedirectionDetailsPojo,
  ReceiptPojo,
  TFetchOrderParams,
  TOrderStatusItem,
} from '../types';
import { ordersService } from './_service-instance';
import queryString from 'query-string';

// ============================================================
// Checkout / Public
// ============================================================

export type TInitiateCheckoutParams = {
  transactionData?: Record<string, string>;
};

const initiateCheckout = (order: OrderPojo) =>
  ordersService.post<PaymentRedirectionDetailsPojo>('/public/checkout', order);

const validateSuccessfulTransaction = (params: TInitiateCheckoutParams) =>
  ordersService.get<unknown>(
    `/public/checkout/validate?${queryString.stringify(params.transactionData ?? {})}`,
  );

const validateAbortedTransaction = (params: TInitiateCheckoutParams) =>
  ordersService.post<unknown>(
    `/public/checkout/validate?${queryString.stringify(params.transactionData ?? {})}`,
  );

const fetchReceipt = (token: string) =>
  ordersService.get<ReceiptPojo>(`/public/receipt/${token}`);

// ============================================================
// Order Management (authenticated)
// ============================================================

const fetchOrderList = (params: TFetchOrderParams) =>
  ordersService.get<DataPage<OrderPojo>>('/orders', {
    params: { allRequestParams: params },
  });

const fetchOrderDetail = (buyOrder: string | number) =>
  ordersService.get<OrderPojo>(`/orders/${buyOrder}`);

const createOrder = (order: OrderPojo) =>
  ordersService.post<OrderPojo>('/orders', order);

const updateOrder = ({
  buyOrder,
  body,
}: {
  buyOrder: string | number;
  body: Partial<OrderPojo>;
}) =>
  ordersService.patch(`/orders/${buyOrder}`, body);

const rejectOrder = (order: OrderPojo) =>
  ordersService.post<unknown>('/orders/rejection', order);

const confirmOrder = (order: OrderPojo) =>
  ordersService.post<unknown>('/orders/confirmation', order);

const completeOrder = (order: OrderPojo) =>
  ordersService.post<unknown>('/orders/completion', order);

// ============================================================
// Order Statuses & Billing Types
// ============================================================

const fetchOrderStatuses = () =>
  ordersService.get<BaseJSONResponse<TOrderStatusItem[]>>('/order_statuses', {
    params: { allRequestParams: {} },
  });

const fetchBillingTypes = () =>
  ordersService.get<BaseJSONResponse<BillingTypePojo[]>>('/billing_types', {
    params: { allRequestParams: {} },
  });

// ============================================================
// Exports
// ============================================================

export const checkoutApi = Object.freeze({
  initiate: initiateCheckout,
  validateSuccess: validateSuccessfulTransaction,
  validateAborted: validateAbortedTransaction,
  fetchReceipt,
});

export const ordersApi = Object.freeze({
  fetchList: fetchOrderList,
  fetchDetail: fetchOrderDetail,
  create: createOrder,
  update: updateOrder,
  reject: rejectOrder,
  confirm: confirmOrder,
  complete: completeOrder,
  fetchStatuses: fetchOrderStatuses,
  fetchBillingTypes,
});
