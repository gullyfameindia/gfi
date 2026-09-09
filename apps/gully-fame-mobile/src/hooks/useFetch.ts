


import { useState, useCallback, useRef } from 'react';
import { useAsync, AsyncState } from './useAsync';

interface UseFetchOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}


const fetchCache = new Map<string, CacheEntry<any>>();








export const useFetch = <T,>(
  url: string,
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions = {}
) => {
  const {
    immediate = true,
    retries = 3,
    retryDelay = 1000,
    cache = true,
    cacheTime = 5 * 60 * 1000, 
    onSuccess,
    onError,
  } = options;

  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  
  const getCachedData = useCallback((): T | null => {
    if (!cache) return null;

    const cached = fetchCache.get(url);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > cacheTime;
      if (!isExpired) {
        return cached.data;
      } else {
        fetchCache.delete(url);
      }
    }
    return null;
  }, [url, cache, cacheTime]);

  
  const setCachedData = useCallback(
    (data: T) => {
      if (cache) {
        fetchCache.set(url, {
          data,
          timestamp: Date.now(),
        });
      }
    },
    [url, cache]
  );

  
  const fetchWithRetry = useCallback(async (): Promise<T> => {
    try {
      
      const cachedData = getCachedData();
      if (cachedData) {
        return cachedData;
      }

      
      const data = await fetchFunction();

      
      setCachedData(data);

      
      setRetryCount(0);

      return data;
    } catch (error: any) {
      
      if (retryCount < retries) {
        return new Promise((resolve, reject) => {
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchWithRetry().then(resolve).catch(reject);
          }, retryDelay * (retryCount + 1)); 
        });
      }

      throw error;
    }
  }, [fetchFunction, retryCount, retries, retryDelay, getCachedData, setCachedData]);

  
  const asyncState = useAsync<T>(fetchWithRetry, {
    immediate,
    onSuccess,
    onError,
  });

  
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  
  const clearCache = useCallback(() => {
    fetchCache.delete(url);
  }, [url]);

  
  const refetch = useCallback(async () => {
    clearCache();
    setRetryCount(0);
    return asyncState.execute();
  }, [asyncState, clearCache]);

  return {
    ...asyncState,
    refetch,
    clearCache,
    retryCount,
    cleanup,
  };
};

export default useFetch;
