'use client';

import { Select as SelectPrimitive } from '@base-ui/react/select';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const Dropdown = SelectPrimitive.Root;

function DropdownValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="dropdown-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  );
}

function DropdownTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="dropdown-trigger"
      className={cn(
        'group/dropdown flex h-12 w-50 items-center justify-between gap-2 rounded-[6px] border border-border-default bg-bg-default px-4 py-3 text-b2 [color:var(--color-text-default)] outline-none select-none focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-ring/50 data-placeholder:text-text-info data-popup-open:rounded-b-none data-popup-open:border-b-0 disabled:cursor-not-allowed disabled:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="flex shrink-0 transition-transform group-data-popup-open/dropdown:rotate-180">
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function DropdownContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 0,
  align = 'start',
  alignOffset = 0,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={false}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="dropdown-content"
          className={cn(
            'w-(--anchor-width) min-w-40.5 origin-(--transform-origin) overflow-hidden rounded-b-[6px] border border-t-0 border-border-default bg-bg-default p-2 text-b3 [color:var(--color-text-sub)] data-[side=bottom]:slide-in-from-top-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className
          )}
          {...props}
        >
          <SelectPrimitive.List className="flex flex-col gap-1">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function DropdownItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="dropdown-item"
      className={cn(
        'flex w-full cursor-pointer items-center rounded-[6px] px-3 py-2 outline-none select-none focus:bg-rust-50 focus:text-rust-600 data-selected:bg-rust-50 data-selected:text-rust-600 data-disabled:pointer-events-none data-disabled:text-text-disabled',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
};
