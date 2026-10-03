'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/common/Button';
import { Radio, RadioGroup } from '@/components/common/RadioGroup';
import { Textarea } from '@/components/common/Textarea';
import { WITHDRAW_NOTICES, WITHDRAW_REASONS } from '@/constants/mypage';
import { MyWithdrawCompleteDialog } from '@/components/domain/mypage/withdraw/MyWithdrawCompleteDialog';
import { withdrawSchema, type WithdrawFormValues } from '@/lib/schemas/mypage';

function MyWithdrawForm() {
  const router = useRouter();
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    mode: 'onChange',
    defaultValues: { etcReason: '' },
  });

  const reason = useWatch({ control, name: 'reason' });
  const isEtcSelected = reason === 'ETC';

  const onSubmit = () => {
    setIsCompleteOpen(true);
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex max-w-220 flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-t2 text-text-default">회원 탈퇴</h1>
          <p className="text-b2 text-text-sub">
            아래 유의사항을 확인하신 후 탈퇴 절차를 진행해 주세요.
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-7">
          <h2 className="flex items-center gap-2 text-h3 text-text-default">
            <span
              aria-hidden
              className="size-5 shrink-0 bg-current mask-[url(/icons/alert-circle.svg)] mask-center mask-contain mask-no-repeat"
            />
            탈퇴 전 확인해 주세요
          </h2>
          <ul className="flex flex-col gap-2">
            {WITHDRAW_NOTICES.map((notice) => (
              <li key={notice} className="flex gap-2 text-b2 text-text-sub">
                <span aria-hidden>•</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6 rounded-2xl border border-gray-300 bg-white p-7">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 text-text-default">
              탈퇴 사유를 알려주세요
            </h2>
            <p className="text-b2 text-text-sub">
              더 나은 서비스를 만드는 데 소중한 자료로 활용하겠습니다.
            </p>
          </div>

          <RadioGroup
            value={reason ?? ''}
            onValueChange={(value) =>
              setValue('reason', value as WithdrawFormValues['reason'], {
                shouldValidate: true,
              })
            }
            size="medium"
            className="gap-4"
          >
            {WITHDRAW_REASONS.map((item) => (
              <Radio key={item.value} value={item.value} label={item.label} />
            ))}
          </RadioGroup>
          {errors.reason?.message ? (
            <p role="alert" className="text-c1 text-rust-600">
              {errors.reason.message}
            </p>
          ) : null}

          <Textarea
            placeholder="아쉬웠던 점을 자유롭게 작성해 주세요."
            aria-invalid={!!errors.etcReason}
            disabled={!isEtcSelected}
            {...register('etcReason')}
          />
          {errors.etcReason?.message ? (
            <p role="alert" className="text-c1 text-rust-600">
              {errors.etcReason.message}
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={() => router.push('/mypage')}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="secondary"
            size="medium"
            disabled={!isValid}
          >
            회원 탈퇴하기
          </Button>
        </div>
      </form>

      <MyWithdrawCompleteDialog
        open={isCompleteOpen}
        onOpenChange={setIsCompleteOpen}
      />
    </>
  );
}

export { MyWithdrawForm };
