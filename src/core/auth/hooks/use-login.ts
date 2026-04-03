'use client';

import useSWRMutation from 'swr/mutation';
import { authApi, LoginBody, LoginResponse } from 'src/services/rest-api/app-api/auth/auth';
import { getErrorMessage } from 'src/services/rest-api/app-api/error-handler';

const loginMutator = async (_key: string, { arg }: { arg: LoginBody }) => {
  const res = await authApi.login(arg);
  // Backend returns "Bearer <token>" as plain text body on success
  const raw = typeof res.data === 'string' ? res.data : '';
  const token = raw.replace(/^Bearer\s+/i, '').trim();
  return { token } as LoginResponse;
};

export const useLogin = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    LoginResponse,
    unknown,
    string,
    LoginBody
  >('auth/login', loginMutator);

  return {
    login: trigger,
    isLoggingIn: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};
