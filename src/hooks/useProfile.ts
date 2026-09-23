import { useMutation } from '@tanstack/react-query';

import { checkNickname, updateProfile } from '@/apis/profile';

const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

function useCheckNickname() {
  return useMutation({
    mutationFn: checkNickname,
  });
}

export { profileKeys, useCheckNickname, useUpdateProfile };
