'use client';

import { useState } from 'react';

import { Pagination } from '@/components/common/Pagination';

type MyQaResultTextAnswerPagerProps = {
  answers: string[];
};

function MyQaResultTextAnswerPager({ answers }: MyQaResultTextAnswerPagerProps) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      <Pagination
        page={page}
        totalPages={answers.length}
        onPageChange={setPage}
        className="justify-end pt-0"
      />
      <div className="rounded-lg border border-gray-300 p-4 text-b2 text-text-default whitespace-pre-wrap">
        {answers[page - 1]}
      </div>
    </div>
  );
}

export { MyQaResultTextAnswerPager };
export type { MyQaResultTextAnswerPagerProps };
