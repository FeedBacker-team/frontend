import { QaFeedbackForm } from '@/components/domain/qa/feedback/QaFeedbackForm';

type QaFeedbackPageProps = {
  params: Promise<{ qaId: string }>;
};

export default async function QaFeedbackPage({
  params,
}: QaFeedbackPageProps) {
  const { qaId } = await params;

  return <QaFeedbackForm feedbackPostId={qaId} />;
}
