import { HomeBanner } from '@/components/domain/home/HomeBanner';

export default function Home() {
  return (
    <div className="flex gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <HomeBanner />
        <section className="flex min-h-200 flex-1 items-center justify-center rounded-2xl bg-white text-b2 text-gray-600">
          검색 · 칩 · 목록
        </section>
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-6">
        <section className="flex min-h-102 items-center justify-center rounded-2xl bg-white text-b2 text-gray-600">
          인기 프로젝트
        </section>
        <section className="flex min-h-102 items-center justify-center rounded-2xl bg-white text-b2 text-gray-600">
          AI 분야 프로젝트
        </section>
      </aside>
    </div>
  );
}
