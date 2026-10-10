type MarkdownCommand =
  | 'heading2'
  | 'heading3'
  | 'bold'
  | 'italic'
  | 'unorderedList'
  | 'orderedList'
  | 'blockquote'
  | 'horizontalRule';

type MarkdownEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type Selection = {
  value: string;
  start: number;
  end: number;
};

function replaceSelection(
  selection: Selection,
  replacement: string,
  selectionStart: number,
  selectionEnd: number
): MarkdownEdit {
  return {
    value:
      selection.value.slice(0, selection.start) +
      replacement +
      selection.value.slice(selection.end),
    selectionStart,
    selectionEnd,
  };
}

function wrapSelection(
  selection: Selection,
  marker: string,
  placeholder: string
): MarkdownEdit {
  const selectedText = selection.value.slice(selection.start, selection.end);
  const markerBeforeSelection = selection.value.slice(
    Math.max(0, selection.start - marker.length),
    selection.start
  );
  const markerAfterSelection = selection.value.slice(
    selection.end,
    selection.end + marker.length
  );

  if (
    selectedText &&
    markerBeforeSelection === marker &&
    markerAfterSelection === marker
  ) {
    const replacementStart = selection.start - marker.length;
    const replacementEnd = selection.end + marker.length;

    return {
      value:
        selection.value.slice(0, replacementStart) +
        selectedText +
        selection.value.slice(replacementEnd),
      selectionStart: replacementStart,
      selectionEnd: replacementStart + selectedText.length,
    };
  }

  const content = selectedText || placeholder;
  const replacement = `${marker}${content}${marker}`;
  const contentStart = selection.start + marker.length;

  return replaceSelection(
    selection,
    replacement,
    contentStart,
    contentStart + content.length
  );
}

function getSelectedLineRange(selection: Selection) {
  const lineStart = selection.value.lastIndexOf('\n', selection.start - 1) + 1;
  const effectiveEnd =
    selection.end > selection.start &&
    selection.value.charAt(selection.end - 1) === '\n'
      ? selection.end - 1
      : selection.end;
  const nextLineBreak = selection.value.indexOf('\n', effectiveEnd);
  const lineEnd =
    nextLineBreak === -1 ? selection.value.length : nextLineBreak;

  return { lineStart, lineEnd };
}

function toggleHeading(
  selection: Selection,
  marker: '## ' | '### '
): MarkdownEdit {
  const { lineStart, lineEnd } = getSelectedLineRange(selection);
  const line = selection.value.slice(lineStart, lineEnd);
  const currentHeading = line.match(/^#{1,6}\s+/)?.[0] ?? '';
  const nextMarker = currentHeading === marker ? '' : marker;
  const lineWithoutHeading = currentHeading
    ? line.slice(currentHeading.length)
    : line;
  const replacement = `${nextMarker}${lineWithoutHeading}`;

  if (selection.start === selection.end) {
    const offsetInContent = Math.max(
      0,
      selection.start - lineStart - currentHeading.length
    );
    const caret = lineStart + nextMarker.length + offsetInContent;

    return replaceSelection(
      { value: selection.value, start: lineStart, end: lineEnd },
      replacement,
      caret,
      caret
    );
  }

  return replaceSelection(
    { value: selection.value, start: lineStart, end: lineEnd },
    replacement,
    lineStart,
    lineStart + replacement.length
  );
}

type LinePrefixOptions = {
  matches: (line: string) => boolean;
  remove: (line: string) => string;
  add: (line: string, index: number) => string;
};

function toggleLinePrefix(
  selection: Selection,
  options: LinePrefixOptions
): MarkdownEdit {
  const { lineStart, lineEnd } = getSelectedLineRange(selection);
  const lines = selection.value.slice(lineStart, lineEnd).split('\n');
  const contentLines = lines.filter((line) => line.trim().length > 0);
  const shouldRemove =
    contentLines.length > 0 && contentLines.every(options.matches);
  let itemIndex = 0;

  const replacement = lines
    .map((line) => {
      if (!line.trim()) {
        return line;
      }

      if (shouldRemove) {
        return options.remove(line);
      }

      const nextLine = options.add(line, itemIndex);
      itemIndex += 1;
      return nextLine;
    })
    .join('\n');

  return replaceSelection(
    { value: selection.value, start: lineStart, end: lineEnd },
    replacement,
    lineStart,
    lineStart + replacement.length
  );
}

function insertHorizontalRule(selection: Selection): MarkdownEdit {
  const needsLeadingBreak =
    selection.start > 0 && selection.value.charAt(selection.start - 1) !== '\n';
  const needsTrailingBreak =
    selection.end < selection.value.length &&
    selection.value.charAt(selection.end) !== '\n';
  const replacement = `${needsLeadingBreak ? '\n' : ''}---\n${
    needsTrailingBreak ? '\n' : ''
  }`;
  const caret = selection.start + replacement.length;

  return replaceSelection(selection, replacement, caret, caret);
}

function applyMarkdownCommand(
  command: MarkdownCommand,
  value: string,
  selectionStart: number,
  selectionEnd: number
): MarkdownEdit {
  const selection = {
    value,
    start: selectionStart,
    end: selectionEnd,
  };

  switch (command) {
    case 'heading2':
      return toggleHeading(selection, '## ');
    case 'heading3':
      return toggleHeading(selection, '### ');
    case 'bold':
      return wrapSelection(selection, '**', '굵은 텍스트');
    case 'italic':
      return wrapSelection(selection, '*', '기울임 텍스트');
    case 'unorderedList':
      return toggleLinePrefix(selection, {
        matches: (line) => /^\s*[-*+]\s+/.test(line),
        remove: (line) => line.replace(/^(\s*)[-*+]\s+/, '$1'),
        add: (line) => `- ${line}`,
      });
    case 'orderedList':
      return toggleLinePrefix(selection, {
        matches: (line) => /^\s*\d+\.\s+/.test(line),
        remove: (line) => line.replace(/^(\s*)\d+\.\s+/, '$1'),
        add: (line, index) => `${index + 1}. ${line}`,
      });
    case 'blockquote':
      return toggleLinePrefix(selection, {
        matches: (line) => /^\s*>\s?/.test(line),
        remove: (line) => line.replace(/^(\s*)>\s?/, '$1'),
        add: (line) => `> ${line}`,
      });
    case 'horizontalRule':
      return insertHorizontalRule(selection);
  }
}

export { applyMarkdownCommand };
export type { MarkdownCommand, MarkdownEdit };
