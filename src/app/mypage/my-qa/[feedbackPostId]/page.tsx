import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/common/Badge';
import { chipVariants } from '@/components/common/chip-variants';
import { MyQaEarlyCloseControls } from '@/components/domain/mypage/MyQaEarlyCloseControls';
import { MyQaFeedbackReviewList } from '@/components/domain/mypage/MyQaFeedbackReviewList';
import {
  getMyQaRecruitDetailById,
  isMyQaFeedbackReviewFilter,
  QA_URGENT_DAYS_LEFT_THRESHOLD,
  REVIEW_FILTER_QUERY_KEY,
} from '@/constants/mypage';

export const metadata: Metadata = {
  title: 'QA 진행 상황',
};

export default async function MyQaRecruitDetailPage(
  props: PageProps<'/mypage/my-qa/[feedbackPostId]'>
) {
  const { feedbackPostId } = await props.params;
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams[REVIEW_FILTER_QUERY_KEY])
    ? searchParams[REVIEW_FILTER_QUERY_KEY][0]
    : searchParams[REVIEW_FILTER_QUERY_KEY];
  const detail = getMyQaRecruitDetailById(feedbackPostId);

  if (!detail) {
    notFound();
  }

  const {
    title,
    tags,
    authorNickname,
    startDate,
    endDate,
    contentType,
    daysLeft,
    rewardAcorn,
    capacity,
    recruitedCount,
    usedAcorn,
    feedbackReviews,
  } = detail;

  const requiredCount = capacity - recruitedCount;
  const progressPercent = Math.round((recruitedCount / capacity) * 100);
  const pendingReviewCount = feedbackReviews.filter(
    (review) => review.status === 'PENDING_REVIEW'
  ).length;

  return (
    <div className="flex gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-t2 text-text-default">QA 진행 상황</h1>
          <p className="text-b2 text-text-sub">
            현재 QA 진행 상황을 한눈에 파악하고, 제출된 피드백을 확인 및 검토해
            보세요.
          </p>
        </div>

        <section className="flex items-center gap-6 rounded-2xl border border-gray-300 bg-white p-7">
          <div className="size-35 shrink-0 rounded-lg bg-gray-200" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag} className={chipVariants({ state: 'unchecked' })}>
                  <span
                    aria-hidden
                    className="size-3 shrink-0 bg-current mask-[url(/icons/hash.svg)] mask-center mask-contain mask-no-repeat"
                  />
                  {tag}
                </li>
              ))}
            </ul>
            <h2 className="text-h2 text-text-default">{title}</h2>
            <div className="flex items-center gap-2 text-c1 text-text-sub">
              <span className="size-5 shrink-0 rounded-full bg-gray-200" />
              {authorNickname}
              <span aria-hidden>·</span>
              {startDate} ~ {endDate}
            </div>
            <div className="flex items-center gap-2">
              <Badge>{contentType}</Badge>
              {daysLeft === null ? (
                <Badge>{endDate} 종료</Badge>
              ) : (
                <Badge
                  variant={
                    daysLeft <= QA_URGENT_DAYS_LEFT_THRESHOLD ? 'rust' : 'green'
                  }
                >
                  D-{daysLeft}
                </Badge>
              )}
              <Badge
                variant="yellow"
                icon={
                  <Image
                    src="/images/acorn.svg"
                    alt="도토리"
                    aria-hidden
                    width={17}
                    height={17}
                    unoptimized
                  />
                }
              >
                {rewardAcorn}
              </Badge>
            </div>
          </div>
        </section>

        <MyQaFeedbackReviewList
          feedbackPostId={feedbackPostId}
          reviews={feedbackReviews}
          initialFilter={
            isMyQaFeedbackReviewFilter(filterParam) ? filterParam : undefined
          }
        />
      </div>

      <aside className="flex h-fit w-80 shrink-0 flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-6">
        <h2 className="text-h3 text-text-default">진행 상황</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-b2">
            <span className="text-text-sub">전체 모집 인원</span>
            <span className="text-text-default">{capacity}명</span>
          </div>
          <div className="flex items-center justify-between text-b2">
            <span className="text-text-sub">완료 인원</span>
            <span className="text-text-default">{recruitedCount}명</span>
          </div>
          <div className="flex items-center justify-between text-b2">
            <span className="text-text-sub">필요 인원</span>
            <span className="text-text-default">{requiredCount}명</span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-rust-600"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-b2 text-rust-600">사용 도토리</span>
          <span className="flex items-center gap-1 text-h4 text-rust-600">
            <Image
              src="/images/acorn.svg"
              alt="도토리"
              aria-hidden
              width={20}
              height={20}
              unoptimized
            />
            {usedAcorn}
          </span>
        </div>
        <MyQaEarlyCloseControls
          feedbackPostId={feedbackPostId}
          daysLeft={daysLeft}
          pendingReviewCount={pendingReviewCount}
        />
      </aside>
    </div>
  );
}
