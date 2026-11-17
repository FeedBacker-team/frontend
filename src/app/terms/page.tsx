import type { Metadata } from 'next';

import { MarkdownContent } from '@/components/common/MarkdownContent';
import { MarkdownToc } from '@/components/common/MarkdownToc';
import { TERMS_CONTENT, TERMS_EFFECTIVE_DATE } from '@/constants/legal';
import { extractMarkdownHeadings } from '@/lib/markdown/headings';

export const metadata: Metadata = {
  title: '이용약관',
};

const TERMS_HEADINGS = extractMarkdownHeadings(TERMS_CONTENT);

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-220 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-t2 text-text-default">이용약관</h1>
        <p className="text-b2 text-text-sub">
          시행일: {TERMS_EFFECTIVE_DATE} · 최종 수정일: {TERMS_EFFECTIVE_DATE}
        </p>
      </div>

      <MarkdownToc headings={TERMS_HEADINGS} />

      <section className="rounded-2xl border border-gray-300 bg-white p-7 md:p-10">
        <MarkdownContent>{TERMS_CONTENT}</MarkdownContent>
      </section>
    </div>
  );
}
