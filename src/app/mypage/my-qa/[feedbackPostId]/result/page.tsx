import type { Metadata } from 'next';

import { MyQaResultView } from '@/components/domain/mypage/result/MyQaResultView';

export const metadata: Metadata = {
  title: 'QA 결과',
};

export default async function MyQaResultPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]/result'>
) {
  const { feedbackPostId } = await props.params;

  return <MyQaResultView feedbackPostId={feedbackPostId} />;
}
