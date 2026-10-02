import type { Metadata } from 'next';

import { MyObjectionForm } from '@/components/domain/mypage/MyObjectionForm';

export const metadata: Metadata = {
  title: '이의제기 접수',
};

export default async function MyObjectionPage(
  props: PageProps<'/mypage/objection/[feedbackId]'>
) {
  const { feedbackId } = await props.params;

  return <MyObjectionForm feedbackId={feedbackId} />;
}
