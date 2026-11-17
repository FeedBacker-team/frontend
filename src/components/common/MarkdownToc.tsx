import type { MarkdownHeading } from '@/lib/markdown/headings';

type MarkdownTocProps = {
  headings: MarkdownHeading[];
};

function MarkdownToc({ headings }: MarkdownTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="목차"
      className="rounded-2xl border border-gray-300 bg-white p-6"
    >
      <p className="mb-3 text-h4 text-text-default">목차</p>
      <ol className="flex flex-col gap-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <a href={`#${heading.id}`} className="text-b2 text-text-sub">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { MarkdownToc };
