import type { ReactNode } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import { emojifyShortcodes } from '@/lib/emoji';
import { slugifyHeading } from '@/lib/markdown/headings';
import { cn } from '@/lib/utils';

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join('');
  }

  if (
    node &&
    typeof node === 'object' &&
    'props' in node &&
    node.props &&
    typeof node.props === 'object' &&
    'children' in node.props
  ) {
    return getTextContent(node.props.children as ReactNode);
  }

  return '';
}

const ALLOWED_MARKDOWN_ELEMENTS = [
  'p',
  'br',
  'h2',
  'h3',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
  'a',
  'img',
];

const markdownComponents: Components = {
  p: ({ children }) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
  h2: ({ children }) => (
    <h2
      id={slugifyHeading(getTextContent(children))}
      className="mt-6 mb-3 scroll-mt-20 text-h2 first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={slugifyHeading(getTextContent(children))}
      className="mt-5 mb-2 scroll-mt-20 text-h3 first:mt-0"
    >
      {children}
    </h3>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-gray-300 pl-4 text-text-sub">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-gray-300" />,
  a: ({ children }) => <>{children}</>,
  img: ({ alt }) => <>{alt ? <span>{alt}</span> : null}</>,
};

type MarkdownContentProps = {
  children: string;
  className?: string;
};

function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={cn('text-text-default', className)}>
      <Markdown
        allowedElements={ALLOWED_MARKDOWN_ELEMENTS}
        components={markdownComponents}
        remarkPlugins={[remarkBreaks]}
        skipHtml
        unwrapDisallowed
      >
        {emojifyShortcodes(children)}
      </Markdown>
    </div>
  );
}

export { MarkdownContent };
export type { MarkdownContentProps };
