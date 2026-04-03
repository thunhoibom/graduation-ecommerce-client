import { createApiService } from '../utils';
import { appApiIns } from '../api-instance';

export const customersService = createApiService(appApiIns, '/data');
