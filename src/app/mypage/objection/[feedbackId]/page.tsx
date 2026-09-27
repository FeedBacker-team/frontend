import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MyObjectionForm } from '@/components/domain/mypage/MyObjectionForm';
import { getMyQaParticipationDetailById } from '@/constants/mypage';

export const metadata: Metadata = {
  title: '이의제기 접수',
};

export default async function MyObjectionPage(
  props: PageProps<'/mypage/objection/[feedbackId]'>
) {
  const { feedbackId } = await props.params;
  const detail = getMyQaParticipationDetailById(feedbackId);

  if (!detail || !detail.rejectReason || detail.objection) {
    notFound();
  }

  return <MyObjectionForm detail={detail} />;
}
