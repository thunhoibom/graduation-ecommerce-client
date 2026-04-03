import { DataPage, PersonPojo, TFetchCustomerParams } from '../types';
import { customersService } from './_service-instance';

const fetchCustomerList = (params?: TFetchCustomerParams) =>
  customersService.get<DataPage<PersonPojo>>('/customers', {
    params: { allRequestParams: params ?? {} },
  });

export const customersApi = Object.freeze({
  fetchList: fetchCustomerList,
});
