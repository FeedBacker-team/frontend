import { Button } from '@/components/common/Button';

function ProjectActionBar() {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="medium"
          className="h-12.5 rounded-xl px-6.5 font-normal"
        >
          수정
        </Button>
        <Button
          variant="outline"
          size="medium"
          className="h-12.5 rounded-xl px-6.5 font-normal"
        >
          삭제
        </Button>
      </div>
      <Button
        size="medium"
        className="h-12.5 rounded-xl font-normal"
        leftIcon={
          <span
            aria-hidden
            className="size-5 bg-gray-50 mask-[url(/icons/megaphone.svg)] mask-center mask-contain mask-no-repeat"
          />
        }
      >
        QA 모집 글 작성하기
      </Button>
    </div>
  );
}

export { ProjectActionBar };
