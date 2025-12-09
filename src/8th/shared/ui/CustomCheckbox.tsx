'use client'

import { Assets } from '@/8th/assets/asset-library'
import Image from 'next/image'
import React from 'react'
import {
  CheckboxLabelStyle,
  CheckboxStyle,
  HiddenCheckboxStyle,
} from '../styled/SharedStyled'
import { BoxStyle } from './Misc'

interface CustomCheckboxProps {
  id: string
  checked?: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export default function CustomCheckbox({
  id,
  checked = false,
  onChange,
  label,
}: CustomCheckboxProps) {
  const handleToggle = () => {
    onChange(!checked)
  }

  const onClickCheckbox = (event: React.MouseEvent) => {
    event.preventDefault()
    handleToggle()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <BoxStyle display="flex" alignItems="center" gap={12}>
      <HiddenCheckboxStyle
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleToggle}
      />
      <CheckboxStyle
        checked={checked}
        onClick={onClickCheckbox}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={handleKeyDown}>
        {checked && (
          <Image
            src={Assets.Icon.checkWhite}
            alt="check"
            width={20}
            height={20}
          />
        )}
      </CheckboxStyle>
      {label && (
        <CheckboxLabelStyle
          htmlFor={id}
          onClick={onClickCheckbox}
          style={{ cursor: 'pointer' }}>
          {label}
        </CheckboxLabelStyle>
      )}
    </BoxStyle>
  )
}
