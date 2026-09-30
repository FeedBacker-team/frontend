import { useMutation, useQuery } from '@tanstack/react-query';

import { checkNickname, getProfile, updateProfile } from '@/apis/users';

const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

type UseProfileOptions = {
  enabled?: boolean;
};

function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

function useProfile({ enabled = true }: UseProfileOptions = {}) {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getProfile,
    enabled,
  });
}

function useCheckNickname() {
  return useMutation({
    mutationFn: checkNickname,
  });
}

export { profileKeys, useCheckNickname, useProfile, useUpdateProfile };
