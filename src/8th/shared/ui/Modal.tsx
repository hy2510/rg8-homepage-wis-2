'use client'

import { BookInfoModalStyle } from '../styled/FeaturesStyled'
import {
  MiniModalContainerStyle,
  ModalContainerStyle,
} from '../styled/SharedStyled'
import { useLockBodyScroll } from './Misc'
import ModalPortal from './ModalPortal'

export function ModalContainer({
  excludePortal = false,
  children,
}: {
  excludePortal?: boolean
  children: React.ReactNode
}) {
  useLockBodyScroll()

  if (excludePortal) {
    return (
      <BookInfoModalStyle>
        <ModalContainerStyle>{children}</ModalContainerStyle>
      </BookInfoModalStyle>
    )
  }
  return (
    <ModalPortal>
      <BookInfoModalStyle>
        <ModalContainerStyle>{children}</ModalContainerStyle>
      </BookInfoModalStyle>
    </ModalPortal>
  )
}

export function MiniModalContainer({
  children,
}: {
  children: React.ReactNode
}) {
  useLockBodyScroll()

  return <MiniModalContainerStyle>{children}</MiniModalContainerStyle>
}
