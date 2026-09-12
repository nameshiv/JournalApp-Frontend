import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status: number;
}

export function getErrorMessage(error: unknown, context?:'login'): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;

    if (status === 0) {
      return {
        message: 'Unable to reach the server. Please check your connection.',
        status: 0,
      };
    }

      if (context === 'login' && (status === 400 || status === 401)) {
      return {
        message: 'Incorrect username or password.',
        status,
      };
    }

    const serverMessage = error.response?.data?.message || error.response?.data?.error;

    const statusMessages: Record<number, string> = {
      400: serverMessage || 'The request was invalid. Please check your input.',
      401: 'Your session has expired. Please log in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      500: 'Something went wrong on the server. Please try again later.',
    };

    return {
      message: statusMessages[status] || serverMessage || 'An unexpected error occurred.',
      status,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    status: 0,
  };
}
