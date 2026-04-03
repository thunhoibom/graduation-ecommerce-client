import { BaseJSONResponse, ProductCategoryPojo, TFetchCategoryParams } from '../types';
import { productsService } from './_service-instance';

const fetchCategoryList = (params?: TFetchCategoryParams) =>
  productsService.get<BaseJSONResponse<ProductCategoryPojo[]>>('/product_categories', {
    params: { allRequestParams: params ?? {} },
  });

export const categoriesApi = Object.freeze({
  fetchList: fetchCategoryList,
});
