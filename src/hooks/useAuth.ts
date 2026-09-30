import { useMutation } from '@tanstack/react-query';

import {
  login,
  loginWithKakao,
  logout,
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

function useKakaoLogin() {
  return useMutation({
    mutationFn: loginWithKakao,
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

function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export {
  authKeys,
  useKakaoLogin,
  useLogin,
  useLogout,
  useSendEmailVerification,
  useSignup,
  useVerifyEmailCode,
};
