import { useState, useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showSuccessMessage?: string;
  showErrorMessage?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { showNotification } = useNotification();

  const execute = async (...args: any[]): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options.showSuccessMessage) {
        showNotification(options.showSuccessMessage, 'success');
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (options.onError) {
        options.onError(err);
      }
      
      if (options.showErrorMessage !== false) {
        const errorMessage = (err as any)?.response?.data?.message || 'An error occurred';
        showNotification(errorMessage, 'error');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
}

export function useApiEffect<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiHook = useApi(apiFunction, options);

  useEffect(() => {
    apiHook.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return apiHook;
}