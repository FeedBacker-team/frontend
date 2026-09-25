import type { Metadata } from 'next';

import { MyWithdrawForm } from '@/components/domain/mypage/MyWithdrawForm';

export const metadata: Metadata = {
  title: '회원 탈퇴',
};

export default function MyWithdrawPage() {
  return <MyWithdrawForm />;
}
