// Created by Kiro
// useAsync Hook - Generic async data fetching with loading, error, and data states

import { useState, useEffect, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Generic hook for handling async operations
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately on mount (default: true)
 * @param onSuccess - Callback on success
 * @param onError - Callback on error
 * @returns Object with data, loading, error, and execute function
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Execute async function
  const execute = useCallback(async () => {
    try {
      setState({ data: null, loading: true, error: null });

      const response = await asyncFunction();

      setState({ data: response, loading: false, error: null });

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';

      setState({ data: null, loading: false, error: errorMessage });

      if (onError) {
        onError(errorMessage);
      }

      throw error;
    }
  }, [asyncFunction, onSuccess, onError]);

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
};

export default useAsync;
