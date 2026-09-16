"use client"

import { Chip } from "@/components/common/Chip"

export interface TagProps {
  value: string
  label: string
  selected?: boolean
  disabled?: boolean
  onClick?: (value: string) => void
}

function Tag({ value, label, selected = false, disabled = false, onClick }: TagProps) {
  const state = disabled ? "disabled" : selected ? "checked" : "unchecked"

  return (
    <Chip
      label={label}
      state={state}
      onClick={onClick ? () => onClick(value) : undefined}
    />
  )
}

export { Tag }
