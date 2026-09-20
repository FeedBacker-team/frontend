import Image from 'next/image';
import Link from 'next/link';

const CONTACT_ITEMS = [
  {
    label: '대표 전화',
    value: '000-0000-0000',
    href: 'tel:000-0000-0000',
  },
  {
    label: '대표 이메일',
    value: 'feedbacker.dev@gmail.com',
    href: 'mailto:feedbacker.dev@gmail.com',
  },
] as const;

const LINK_ITEMS = [
  { href: '/support', label: '고객센터' },
  { href: '/terms', label: '이용약관' },
  { href: '/privacy', label: '개인정보처리방침' },
  { href: '/notices', label: '공지사항' },
  { href: '/faq', label: 'FAQ' },
] as const;

function Footer() {
  return (
    <footer className="w-full border-t border-gray-400 bg-gray-200 px-6 py-10 md:px-30 md:py-15">
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
          <div className="flex gap-3.25" aria-hidden>
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="size-10 shrink-0 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-h4 whitespace-nowrap text-gray-900">
                  {item.label}
                </span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-gray-400" />
                <a
                  href={item.href}
                  className="text-b2 whitespace-nowrap text-gray-800"
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col items-end gap-8 md:w-108.75">
            <nav className="flex w-full flex-wrap items-center justify-end gap-x-7 gap-y-2 md:flex-nowrap md:justify-start">
              {LINK_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-h4 whitespace-nowrap text-gray-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="w-full text-right text-b2 text-gray-800">
              © {new Date().getFullYear()} Feedbacker. all rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
