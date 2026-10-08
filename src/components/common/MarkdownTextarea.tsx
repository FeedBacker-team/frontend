'use client';

import React, {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEventHandler,
  type ReactNode,
} from 'react';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
} from 'lucide-react';

import { Button } from '@/components/common/Button';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { Textarea, type TextareaProps } from '@/components/common/Textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/common/Tooltip';
import {
  applyMarkdownCommand,
  type MarkdownCommand,
} from '@/lib/markdown/commands';
import { cn } from '@/lib/utils';

type ToolbarItem = {
  command: MarkdownCommand;
  icon: ReactNode;
  label: string;
};

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { command: 'heading2', icon: <Heading2 />, label: '제목 2' },
  { command: 'heading3', icon: <Heading3 />, label: '제목 3' },
  { command: 'bold', icon: <Bold />, label: '굵게' },
  { command: 'italic', icon: <Italic />, label: '기울임' },
  { command: 'unorderedList', icon: <List />, label: '글머리 목록' },
  { command: 'orderedList', icon: <ListOrdered />, label: '번호 목록' },
  { command: 'blockquote', icon: <Quote />, label: '인용' },
  { command: 'horizontalRule', icon: <Minus />, label: '구분선' },
];

type MarkdownTextareaProps = Omit<TextareaProps, 'ref'>;

function setNativeTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value'
  )?.set;

  valueSetter?.call(textarea, value);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

const MarkdownTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MarkdownTextareaProps
>(function MarkdownTextarea(
  { className, disabled, maxLength, onChange, state, ...props },
  forwardedRef
) {
  const generatedId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [previewValue, setPreviewValue] = useState('');
  const editorId = props.id ?? `markdown-editor-${generatedId}`;
  const previewId = `${editorId}-preview`;
  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const handleCommand = (command: MarkdownCommand) => {
    const textarea = textareaRef.current;

    if (!textarea || disabled) {
      return;
    }

    const edit = applyMarkdownCommand(
      command,
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (typeof maxLength === 'number' && edit.value.length > maxLength) {
      return;
    }

    setNativeTextareaValue(textarea, edit.value);
    textarea.focus();
    textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onChange?.(event);
  };

  const handleEditView = () => {
    setView('edit');
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handlePreviewView = () => {
    setPreviewValue(textareaRef.current?.value ?? '');
    setView('preview');
  };

  return (
    <div
      data-slot="markdown-textarea"
      className={cn(
        'overflow-hidden rounded-lg border bg-transparent transition-colors focus-within:border-ring',
        state === 'error' ? 'border-[#ff383c]' : 'border-input',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50'
      )}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-gray-300 bg-bg-light px-2 py-1">
        <div
          role="toolbar"
          aria-label="마크다운 서식"
          className="flex flex-wrap items-center gap-1"
        >
          {TOOLBAR_ITEMS.map((item) => (
            <Tooltip key={item.command}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={item.label}
                    disabled={disabled || view === 'preview'}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-text-sub outline-none hover:bg-gray-200 hover:text-text-default focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleCommand(item.command)}
                  />
                }
              >
                {item.icon}
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div
          role="group"
          aria-label="마크다운 보기 방식"
          className="flex shrink-0 items-center rounded-[6px] border border-gray-300 bg-bg-default p-0.5"
        >
          <Button
            type="button"
            variant="outline"
            size="small"
            aria-controls={editorId}
            aria-pressed={view === 'edit'}
            className={cn(
              'h-auto rounded-[4px] border-0 bg-transparent px-2.5 py-1 font-normal text-text-sub hover:border-0 hover:bg-gray-100 hover:text-text-default active:border-0 active:bg-gray-200',
              view === 'edit' && 'bg-gray-200 font-bold text-text-default'
            )}
            onClick={handleEditView}
          >
            작성
          </Button>
          <Button
            type="button"
            variant="outline"
            size="small"
            aria-controls={previewId}
            aria-pressed={view === 'preview'}
            className={cn(
              'h-auto rounded-[4px] border-0 bg-transparent px-2.5 py-1 font-normal text-text-sub hover:border-0 hover:bg-gray-100 hover:text-text-default active:border-0 active:bg-gray-200',
              view === 'preview' && 'bg-gray-200 font-bold text-text-default'
            )}
            onClick={handlePreviewView}
          >
            미리보기
          </Button>
        </div>
      </div>

      <Textarea
        id={editorId}
        ref={setTextareaRef}
        className={cn(
          'rounded-none border-0 focus-visible:border-transparent focus-visible:ring-0',
          view === 'preview' && 'hidden',
          className
        )}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleChange}
        state={state}
        {...props}
      />

      {view === 'preview' ? (
        <div
          id={previewId}
          className={cn('min-h-27 overflow-y-auto px-3 py-3', className)}
        >
          {previewValue ? (
            <MarkdownContent className="text-b2">
              {previewValue}
            </MarkdownContent>
          ) : (
            <p className="text-b2 text-text-disabled">
              미리보기할 내용이 없어요.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
});

MarkdownTextarea.displayName = 'MarkdownTextarea';

export { MarkdownTextarea };
export type { MarkdownTextareaProps };
