import { createApiService } from '../utils';
import { appApiIns } from '../api-instance';

export const authService = createApiService(appApiIns, '/');
