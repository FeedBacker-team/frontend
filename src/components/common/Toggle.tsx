'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from 'cn';

export interface ToggleProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  label,
}: ToggleProps) {
  return (
    <label className="flex items-center gap-2">
      <SwitchPrimitive.Root
        data-slot="toggle"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-7 w-13.5 shrink-0 items-center rounded-full px-1 transition-colors outline-none disabled:cursor-not-allowed',
          disabled ? 'bg-[#F1F1F5]' : checked ? 'bg-green-600' : 'bg-[#A5ADB8]'
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 left-1.5 -translate-y-1/2 text-[0.625rem] font-bold transition-opacity duration-200 ml-1.5',
            checked ? 'opacity-100' : 'opacity-0',
            disabled ? 'text-[#999]' : 'text-white'
          )}
        >
          ON
        </span>
        <span
          className={cn(
            'absolute top-1/2 right-1.5 -translate-y-1/2 text-[0.625rem] font-bold transition-opacity duration-200 mr-0.5',
            checked ? 'opacity-0' : 'opacity-100',
            disabled ? 'text-[#999]' : 'text-white'
          )}
        >
          OFF
        </span>
        <SwitchPrimitive.Thumb
          data-slot="toggle-thumb"
          className={cn(
            'size-5 shrink-0 rounded-full shadow transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-6.5' : 'translate-x-0',
            disabled ? 'bg-[#DBDBE4]' : 'bg-white'
          )}
        />
      </SwitchPrimitive.Root>
      {label && <span className="text-[0.875rem] text-black">{label}</span>}
    </label>
  );
}

export { Toggle };
