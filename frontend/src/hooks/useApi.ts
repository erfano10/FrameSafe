import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFn: (...args: unknown[]) => Promise<{ success: boolean; data?: T; message?: string }>
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiFn(...args);
        if (response.success && response.data !== undefined) {
          setState({ data: response.data, loading: false, error: null });
          return response.data;
        }
        const errorMsg = response.message || 'Terjadi kesalahan';
        setState({ data: null, loading: false, error: errorMsg });
        return null;
      } catch (err: unknown) {
        const errorMsg =
          (err as { response?: { data?: { message?: string } }; message?: string })
            ?.response?.data?.message ||
          (err as { message?: string })?.message ||
          'Terjadi kesalahan';
        setState({ data: null, loading: false, error: errorMsg });
        return null;
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
