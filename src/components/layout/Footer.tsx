import Image from 'next/image';
import Link from 'next/link';

const CONTACT_ITEMS = [
  // {
  //   label: '대표 전화',
  //   value: '000-0000-0000',
  //   href: 'tel:000-0000-0000',
  // },
  {
    label: '대표 이메일',
    value: 'feedbacker.dev@gmail.com',
    href: 'mailto:feedbacker.dev@gmail.com',
  },
] as const;

const LINK_ITEMS = [
  // { href: '/support', label: '고객센터' },
  {
    href: '/terms',
    label: '이용약관',
  },
  {
    href: '/privacy',
    label: '개인정보처리방침',
  },
  // { href: '/notices', label: '공지사항' },
  {
    href: '/faq',
    label: 'FAQ',
  },
] as const;

const SOCIAL_ITEMS = [
  {
    href: 'https://www.instagram.com/feedbacker.team/',
    label: 'Feedbacker Instagram',
    icon: '/icons/Instagram.svg',
    width: 20,
    height: 20,
  },
  {
    href: 'https://www.threads.com/@feedbacker.team',
    label: 'Feedbacker Threads',
    icon: '/icons/threads.svg',
    width: 18,
    height: 20,
  },
  {
    href: 'https://blog.naver.com/feedbacker_team',
    label: 'Feedbacker Naver Blog',
    icon: '/icons/naverblog.svg',
    width: 22,
    height: 21,
  },
] as const;

type SocialItem = (typeof SOCIAL_ITEMS)[number];

function FooterSocialItem({ item }: { item: SocialItem }) {
  const icon = (
    <Image
      src={item.icon}
      alt=""
      width={item.width}
      height={item.height}
      unoptimized
    />
  );
  const className =
    'flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-default';

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      className={className}
    >
      {icon}
    </a>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border-default bg-bg-deep">
      <div className="mx-auto flex w-full flex-col gap-10 px-6 py-10 md:w-app-canvas md:gap-6 md:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative h-5.5 w-40 shrink-0">
            <Image
              src="/images/Logo_text.svg"
              alt="Feedbacker"
              width={160}
              height={22}
              unoptimized
              className="h-5.5 w-40 object-contain"
            />
          </Link>
          <div className="flex gap-3.25">
            {SOCIAL_ITEMS.map((item) => (
              <FooterSocialItem key={item.label} item={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:w-1/2">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-c1 whitespace-nowrap text-text-default">
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="h-3 w-px shrink-0 bg-border-default"
                />
                <Link
                  href={item.href}
                  className="text-b3 whitespace-nowrap text-text-default"
                >
                  {item.value}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-end gap-8 md:w-58.5 md:gap-5">
            <nav className="flex w-full flex-wrap items-center justify-end gap-x-7 gap-y-2 md:flex-nowrap">
              {LINK_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-c1 whitespace-nowrap text-text-sub"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="w-full text-right text-b3 text-text-sub">
              © {new Date().getFullYear()} Feedbacker. all rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
