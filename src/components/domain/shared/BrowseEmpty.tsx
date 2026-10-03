import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

type BrowseEmptyProps = {
  title: string;
  onResetTags: () => void;
  className?: string;
};

function BrowseEmpty({ title, onResetTags, className }: BrowseEmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl bg-bg-deep px-5 py-16',
        className
      )}
    >
      <img
        src="/images/browse-empty.svg"
        alt=""
        aria-hidden
        width={229}
        height={76}
      />
      <div className="flex flex-col items-center gap-1">
        <p className="text-h2 text-text-sub">{title}</p>
        <p className="text-b3 text-text-info">
          다른 키워드로 검색하거나 선택한 태그를 변경해 보세요.
        </p>
      </div>
      <Button variant="outline" size="medium" onClick={onResetTags}>
        태그 초기화
      </Button>
    </div>
  );
}

export { BrowseEmpty };
export type { BrowseEmptyProps };
