import type { Metadata } from 'next';

import { RequireCompletedProfile } from '@/components/domain/auth/RequireCompletedProfile';
import { QaFeedbackForm } from '@/components/domain/qa/feedback/QaFeedbackForm';
import { createRobotsMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: 'QA 피드백 작성',
  robots: createRobotsMetadata(false),
};

type QaFeedbackPageProps = {
  params: Promise<{ qaId: string }>;
};

export default async function QaFeedbackPage({
  params,
}: QaFeedbackPageProps) {
  const { qaId } = await params;

  return (
    <RequireCompletedProfile fallbackHref={`/qa/${qaId}`}>
      <QaFeedbackForm feedbackPostId={qaId} />
    </RequireCompletedProfile>
  );
}
