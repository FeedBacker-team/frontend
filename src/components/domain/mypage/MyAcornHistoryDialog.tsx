'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { Dialog, DialogContent } from '@/components/common/Dialog';
import { cn } from '@/lib/utils';
import type { AcornTransactionItem } from '@/types/mypage';

type MyAcornHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acornCount: number;
  transactions: AcornTransactionItem[];
  pageSize: number;
};

function MyAcornHistoryDialog({
  open,
  onOpenChange,
  acornCount,
  transactions,
  pageSize,
}: MyAcornHistoryDialogProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const pageItems = transactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setPage(1);
        }
      }}
    >
      <DialogContent className="relative w-175.75 max-w-[calc(100vw-2rem)] gap-6 pt-6 pb-9">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 flex size-5 cursor-pointer items-center justify-center"
        >
          <Image
            src="/icons/x.svg"
            alt=""
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
        </button>

        <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-4">
          <h2 className="text-h1 text-text-default">도토리 사용 내역</h2>
          <p className="flex items-center gap-2 text-t3 text-text-default">
            <Image
              src="/images/acorn.svg"
              alt=""
              aria-hidden
              width={24}
              height={32}
              unoptimized
              className="h-8 w-6 object-contain"
            />
            {acornCount}
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-b2 text-center text-text-sub">
              아직 도토리 사용 내역이 없어요
              <br />
              QA 모집을 해보고 도토리를 사용해 보세요
            </p>
            <Button
              variant="outline"
              size="medium"
              nativeButton={false}
              render={<Link href="/qa/new" />}
            >
              QA 모집하기
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {pageItems.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-yellow-50 px-5 py-4"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-h4 text-text-default">
                      {transaction.title}
                    </p>
                    <p className="text-c1 text-text-info">{transaction.date}</p>
                  </div>
                  <p
                    className={cn(
                      'text-h4',
                      transaction.amount > 0
                        ? 'text-yellow-600'
                        : 'text-text-default'
                    )}
                  >
                    {transaction.amount > 0 ? '+' : '-'}{' '}
                    {Math.abs(transaction.amount)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-6 pt-2">
              <Button
                variant="outline"
                size="small"
                aria-label="이전 페이지"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                leftIcon={
                  <span
                    aria-hidden
                    className="size-4 bg-current mask-[url(/icons/chevron-left.svg)] mask-center mask-contain mask-no-repeat"
                  />
                }
              />
              <p className="text-h4 text-text-default">
                {String(page).padStart(2, '0')}
                <span className="text-text-disabled">
                  {' / '}
                  {String(totalPages).padStart(2, '0')}
                </span>
              </p>
              <Button
                variant="outline"
                size="small"
                aria-label="다음 페이지"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                leftIcon={
                  <span
                    aria-hidden
                    className="size-4 bg-current mask-[url(/icons/chevron-right.svg)] mask-center mask-contain mask-no-repeat"
                  />
                }
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { MyAcornHistoryDialog };
export type { MyAcornHistoryDialogProps };
