import { createApiService } from '../utils';
import { appApiIns } from '../api-instance';

export const aboutService = createApiService(appApiIns, '/public');
