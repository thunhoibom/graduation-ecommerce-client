import { BaseJSONResponse, DataPage, ProductPojo, ProductListPojo, TFetchProductParams } from '../types';
import { productsService } from './_service-instance';

// ============================================================
// Products
// ============================================================

const fetchProductList = (params: TFetchProductParams) =>
  productsService.get<DataPage<ProductPojo>>('/products', {
    params: { allRequestParams: params },
  });

const fetchProductDetail = (barcode: string) =>
  productsService.get<ProductPojo>(`/products?barcode=${barcode}`);

const addProduct = (body: Omit<ProductPojo, 'id'>) =>
  productsService.post<ProductPojo>('/products', body);

const updateProduct = ({ barcode, body }: { barcode: string; body: Partial<ProductPojo> }) =>
  productsService.patch(`/products/${barcode}`, body);

// ============================================================
// Product Lists
// ============================================================

const fetchProductListItems = (listCode: string, params?: TFetchProductParams) =>
  productsService.get<DataPage<ProductPojo>>(`/product_list_contents?requestParams=${encodeURIComponent(JSON.stringify({ code: listCode, ...params }))}`);

// ============================================================
// Product Categories
// ============================================================

import { ProductCategoryPojo, TFetchCategoryParams } from '../types';

const fetchCategoryList = (params?: TFetchCategoryParams) =>
  productsService.get<BaseJSONResponse<ProductCategoryPojo[]>>('/product_categories', {
    params: { allRequestParams: params ?? {} },
  });

const fetchCategoryDetail = (code: string) =>
  productsService.get<ProductCategoryPojo>(`/product_categories/${code}`);

export const productsApi = Object.freeze({
  fetchList: fetchProductList,
  fetchDetail: fetchProductDetail,
  add: addProduct,
  update: updateProduct,
  fetchListContents: fetchProductListItems,
  fetchCategories: fetchCategoryList,
  fetchCategoryDetail,
});
