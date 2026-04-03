'use client';

import { useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { authApi } from 'src/services/rest-api/app-api/auth/auth';
import { FETCH_PROFILE } from 'src/constants/swr-keys';
import type { PersonPojo } from 'src/services/rest-api/app-api/types';

const fetcher = () => authApi.fetchProfile().then((r) => r.data);

export const useGetProfile = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('mono_token') : null;

  const { data, error, isLoading, mutate } = useAxiosSWR<PersonPojo>(
    token ? FETCH_PROFILE : null,
    fetcher,
  );

  return {
    data,
    profile: data,
    isLoading,
    error,
    mutate,
  };
};
