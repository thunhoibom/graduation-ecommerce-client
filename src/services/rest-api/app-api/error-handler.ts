import { AxiosError, isAxiosError } from 'axios';
import type { AppError } from './types';

/** Extract human-readable error message from any thrown value */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as AppError | undefined;

    // Backend error payload
    if (data?.message) {
      return data.message;
    }

    // Network / server errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    }

    // Fallback HTTP status messages
    switch (error.response?.status) {
      case 400:
        return 'Yêu cầu không hợp lệ.';
      case 401:
        return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này.';
      case 404:
        return 'Không tìm thấy dữ liệu.';
      case 409:
        return 'Dữ liệu bị xung đột. Vui lòng thử lại.';
      case 500:
        return 'Lỗi máy chủ. Vui lòng thử lại sau.';
      default:
        return error.message || 'Đã xảy ra lỗi không xác định.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra lỗi không xác định.';
};
