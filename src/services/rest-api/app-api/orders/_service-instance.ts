import { createApiService } from '../utils';
import { appApiIns } from '../api-instance';

export const ordersService = createApiService(appApiIns, '/data');
