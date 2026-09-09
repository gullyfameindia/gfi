


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
