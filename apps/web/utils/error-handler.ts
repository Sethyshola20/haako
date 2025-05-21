export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
});

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});

// Error codes remain the same
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // External service errors
  PLAID_ERROR: 'PLAID_ERROR',
  DWOLLA_ERROR: 'DWOLLA_ERROR',
  
  // Transaction errors
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};