import { useMutation } from '@tanstack/react-query';

import {
  login,
  sendEmailVerification,
  signup,
  verifyEmailCode,
} from '@/apis/auth';

const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

function useSendEmailVerification() {
  return useMutation({
    mutationFn: sendEmailVerification,
  });
}

function useVerifyEmailCode() {
  return useMutation({
    mutationFn: verifyEmailCode,
  });
}

function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}

export {
  authKeys,
  useLogin,
  useSendEmailVerification,
  useSignup,
  useVerifyEmailCode,
};
