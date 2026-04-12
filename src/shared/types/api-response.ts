export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    requestId?: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
  return { success: true, data, meta };
}

export function errorResponse(code: string, message: string, details?: unknown, requestId?: string): ApiResponse {
  return {
    success: false,
    error: { code, message, details },
    meta: requestId ? { requestId } : undefined,
  };
}
