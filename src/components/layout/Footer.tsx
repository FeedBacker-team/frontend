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
    href: 'https://decorous-toothbrush-115.notion.site/3ec4c1124e188012be33c7ec032bbfe7?pvs=74',
    label: '이용약관',
  },
  {
    href: 'https://decorous-toothbrush-115.notion.site/3ec4c1124e1880f293d9f1d852e5466d?pvs=74',
    label: '개인정보처리방침',
  },
  // { href: '/notices', label: '공지사항' },
  {
    href: 'https://decorous-toothbrush-115.notion.site/FAQ-3ec4c1124e18809ebe83f12e1a51ed7d?pvs=74',
    label: 'FAQ',
  },
] as const;

const SOCIAL_ITEMS = [
  {
    href: 'https://www.instagram.com/feedbacker.team/',
    label: 'Feedbacker Instagram',
    icon: '/icons/Instagram.svg',
    width: 28,
    height: 28,
  },
  {
    href: 'https://www.threads.com/@feedbacker.team',
    label: 'Feedbacker Threads',
    icon: '/icons/threads.svg',
    width: 24,
    height: 27,
  },
] as const;

function Footer() {
  return (
    <footer className="w-full border-t border-border-default bg-bg-default px-6 py-10 md:px-30 md:py-15">
      <div className="flex flex-col gap-10 md:gap-18.5">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative h-6.75 w-50 shrink-0">
            <Image
              src="/images/Logo_text.svg"
              alt="Feedbacker"
              width={200}
              height={27}
              unoptimized
              className="h-6.75 w-50 object-contain"
            />
          </Link>
          <div className="flex gap-3.25">
            {SOCIAL_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-default"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={item.width}
                  height={item.height}
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2 md:w-1/2">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-h4 whitespace-nowrap text-text-default">
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="h-3 w-px shrink-0 bg-border-default"
                />
                <Link
                  href={item.href}
                  className="text-b2 whitespace-nowrap text-text-default"
                >
                  {item.value}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-end gap-8 md:w-108.75">
            <nav className="flex w-full flex-wrap items-center justify-end gap-x-7 gap-y-2 md:flex-nowrap">
              {LINK_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-h4 whitespace-nowrap text-text-sub"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="w-full text-right text-b2 text-text-sub">
              © {new Date().getFullYear()} Feedbacker. all rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
