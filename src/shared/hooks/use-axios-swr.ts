'use client';

import useSWR from 'swr';

/**
 * SWR hook over Axios — wraps React Query / SWR caching over REST calls.
 *
 * - key: SWR cache key (pass null to disable)
 * - fetcher: called whenever SWR decides to revalidate
 * - options: SWR options
 */
export function useAxiosSWR<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options?: Parameters<typeof useSWR<T, unknown>>[2],
) {
  const { data, error, isLoading, mutate } = useSWR<T, unknown>(key, fetcher, {
    revalidateOnMount: true,
    ...options,
  });

  return { data, error, isLoading, mutate };
}
