function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

type MarkdownHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

const HEADING_LINE_PATTERN = /^(#{2,3})\s+(.+)$/;

function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  return markdown
    .split('\n')
    .map((line) => line.match(HEADING_LINE_PATTERN))
    .filter((match) => match !== null)
    .map((match) => {
      const text = match[2].trim();

      return {
        level: match[1].length === 2 ? 2 : 3,
        text,
        id: slugifyHeading(text),
      } as const;
    });
}

export { extractMarkdownHeadings, slugifyHeading };
export type { MarkdownHeading };
