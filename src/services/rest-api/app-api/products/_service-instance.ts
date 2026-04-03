import { createApiService } from '../utils';
import { appApiIns } from '../api-instance';

export const productsService = createApiService(appApiIns, '/data');
