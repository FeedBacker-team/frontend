'use client';

import * as React from 'react';
import { cn } from 'cn';
import { ko } from 'date-fns/locale';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from 'react-day-picker';

import { Button, buttonVariants } from '@/components/common/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from 'lucide-react';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'outline',
  locale = ko,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar rounded-sm border border-[#e4e4e7] bg-white p-3.25 [--cell-radius:4px] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatCaption: (date, _options, dateLib) =>
          dateLib!.format(date, 'y년 M월'),
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'cursor-pointer select-none rounded-(--cell-radius) border border-gray-400 p-2.25 text-gray-800 hover:border-gray-400 hover:bg-white aria-disabled:opacity-50 [&_svg]:size-4',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'cursor-pointer select-none rounded-(--cell-radius) border border-gray-400 p-2.25 text-gray-800 hover:border-gray-400 hover:bg-white aria-disabled:opacity-50 [&_svg]:size-4',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-9 w-full items-center justify-center px-[34px]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-[0.875rem] font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative rounded-(--cell-radius)',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute inset-0 bg-popover opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'font-semibold text-gray-900 select-none',
          captionLayout === 'label'
            ? 'text-[1rem]'
            : 'flex items-center gap-1 rounded-(--cell-radius) text-[1rem] [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-gray-600 select-none',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-(--cell-size) select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'text-[0.8rem] text-muted-foreground select-none',
          defaultClassNames.week_number
        ),
        day: cn(
          'group/day relative flex aspect-square h-full w-full items-center justify-center rounded-(--cell-radius) p-0 text-center select-none',
          defaultClassNames.day
        ),
        range_start: cn(defaultClassNames.range_start),
        range_middle: cn(defaultClassNames.range_middle),
        range_end: cn(defaultClassNames.range_end),
        today: cn(defaultClassNames.today),
        outside: cn(
          'text-gray-500 aria-selected:text-gray-500',
          defaultClassNames.outside
        ),
        disabled: cn('text-gray-500 opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn('size-4', className)} {...props} />
          );
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;
  const isFilled =
    isSelectedSingle || modifiers.range_start || modifiers.range_end;

  return (
    <Button
      variant="outline"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-today={modifiers.today || undefined}
      data-selected-single={isSelectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'relative isolate z-10 inline-flex aspect-square h-auto min-w-10.5 cursor-pointer items-center justify-center rounded-(--cell-radius) border-0 p-2.25 leading-none font-normal tabular-nums text-gray-900 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10',
        isFilled &&
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        !isFilled &&
          modifiers.range_middle &&
          'bg-muted text-foreground hover:bg-muted hover:text-foreground',
        !isFilled &&
          !modifiers.range_middle &&
          modifiers.today &&
          'bg-gray-200 hover:bg-gray-200',
        !isFilled &&
          !modifiers.range_middle &&
          !modifiers.today &&
          'bg-transparent hover:bg-transparent',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
