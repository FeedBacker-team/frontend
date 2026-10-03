import { QaDetail } from '@/components/domain/qa/detail/QaDetail';

export default async function QaDetailPage(props: PageProps<'/qa/[qaId]'>) {
  const { qaId } = await props.params;
  const searchParams = await props.searchParams;
  const created = Array.isArray(searchParams.created)
    ? searchParams.created[0]
    : searchParams.created;

  return <QaDetail feedbackPostId={qaId} showCreatedToast={created === '1'} />;
}
