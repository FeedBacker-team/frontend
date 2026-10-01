const MOBILE_NAV_ITEMS = [
  {
    label: '프로젝트',
    iconSrc: '/icons/flag.svg',
  },
  {
    label: 'QA',
    iconSrc: '/icons/megaphone.svg',
  },
  {
    label: '마이페이지',
    iconSrc: '/icons/mypage.svg',
  },
] as const;

function MobileFallback() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-default sm:hidden">
      <main className="flex flex-1 items-center justify-center px-6 py-12 text-center">
        <div className="flex max-w-full flex-col items-center">
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-lg bg-rust-50"
          >
            <span className="size-8 bg-rust-600 mask-[url(/icons/info.svg)] mask-center mask-contain mask-no-repeat" />
          </span>
          <h1 className="mt-5 text-t3 text-text-default">
            더 쾌적한 모바일 환경을 준비 중이에요!
          </h1>
          <p className="mt-2 text-b2 text-text-sub">
            편리한 모바일 경험을 위해 열심히 단장 중이에요.
            <br />
            지금은 PC 화면에서 먼저 만나보실 수 있어요.
          </p>
        </div>
      </main>

      <div className="grid shrink-0 grid-cols-3 border-t border-border-default bg-bg-default pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex h-15 flex-col items-center justify-center gap-1 text-c2 text-text-info"
          >
            <span
              aria-hidden
              className="size-6 bg-current mask-center mask-contain mask-no-repeat"
              style={{
                maskImage: `url(${item.iconSrc})`,
                WebkitMaskImage: `url(${item.iconSrc})`,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export { MobileFallback };
