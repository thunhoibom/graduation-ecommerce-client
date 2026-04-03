'use client';

import useSWRMutation from 'swr/mutation';
import { authApi } from 'src/services/rest-api/app-api/auth/auth';
import { RegistrationPojo } from 'src/services/rest-api/app-api/types';
import { getErrorMessage } from 'src/services/rest-api/app-api/error-handler';

const registerMutator = async (_key: string, { arg }: { arg: RegistrationPojo }) =>
  authApi.register(arg);

export const useRegister = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    'register',
    registerMutator,
  );

  return {
    register: (body: RegistrationPojo) => trigger(body),
    isRegistering: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};
