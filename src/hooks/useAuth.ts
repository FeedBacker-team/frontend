import { useMutation } from '@tanstack/react-query';

import { login } from '@/apis/auth';

const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export { authKeys, useLogin };
