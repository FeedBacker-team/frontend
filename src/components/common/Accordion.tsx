'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';

import { cn } from '@/lib/utils';

type AccordionProps = AccordionPrimitive.Root.Props;
type AccordionItemProps = AccordionPrimitive.Item.Props;
type AccordionTriggerProps = AccordionPrimitive.Trigger.Props;
type AccordionPanelProps = AccordionPrimitive.Panel.Props;

function Accordion(props: AccordionProps) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('group border-b border-gray-300 last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex w-full items-center justify-between gap-4 py-5 text-left text-h3 text-text-default',
          className
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="size-5 shrink-0 bg-current mask-[url(/icons/chevron-down.svg)] mask-center mask-contain mask-no-repeat transition-transform duration-200 group-data-[open]:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        'h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
        className
      )}
      {...props}
    >
      <div className="pb-5 text-b2 whitespace-pre-line text-text-sub">
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger };
