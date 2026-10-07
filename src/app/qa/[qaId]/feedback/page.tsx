import { RequireCompletedProfile } from '@/components/domain/auth/RequireCompletedProfile';
import { QaFeedbackForm } from '@/components/domain/qa/feedback/QaFeedbackForm';

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
