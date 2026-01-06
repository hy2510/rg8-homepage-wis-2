'use client'

import { Assets } from '@/8th/assets/asset-library'
import SITE_PATH from '@/app/site-path'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  GoTo7thButtonStyle,
  LogoutButtonStyle,
  MoreHorizontalButtonStyle,
  RoundedFullButtonStyle,
  StartButtonStyle,
} from '../styled/SharedStyled'
import DropdownMenu from './Dropdowns'

// 공통적으로 자주 사용되는 버튼 모음

export function StartButton({
  label = 'Start!',
  onClick,
  isMobile,
  className,
}: {
  label?: string
  onClick?: () => void
  isMobile?: boolean
  className?: string
}) {
  return (
    <StartButtonStyle
      className={className}
      onClick={onClick}
      isMobile={isMobile}>
      {label}
    </StartButtonStyle>
  )
}

interface RoundedFullButtonProps {
  children?: React.ReactNode
  marginTop?: number
  marginBottom?: number
  onClick?: () => void
  viewSmall?: boolean
  fontColor?: string
  fontFamily?: string
  bgColor?: 'primary' | 'secondary'
  active?: boolean
  tabs?: boolean
}

export function RoundedFullButton({
  children,
  marginTop,
  marginBottom,
  onClick,
  viewSmall,
  fontColor,
  fontFamily,
  bgColor,
  active,
  tabs,
}: RoundedFullButtonProps) {
  return (
    <RoundedFullButtonStyle
      marginTop={marginTop}
      marginBottom={marginBottom}
      onClick={onClick}
      isSmall={viewSmall}
      fontColor={fontColor}
      bgColor={bgColor}
      active={active}
      tabs={tabs}
      fontFamily={fontFamily}>
      {children ? children : 'More Books'}
    </RoundedFullButtonStyle>
  )
}

export function MoreHorizontalButton({
  onSpeakClick,
}: {
  onSpeakClick?: () => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <MoreHorizontalButtonStyle onClick={toggleDropdown}>
      <Image
        src={Assets.Icon.moreHorizontalWhite}
        alt="more"
        width={40}
        height={40}
      />
      <DropdownMenu
        items={[
          {
            text: 'Speaking Practice',
            onClick: () => {
              if (onSpeakClick) {
                onSpeakClick()
              }
            },
          },
        ]}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        position={'topRight'}
      />
    </MoreHorizontalButtonStyle>
  )
}

export function LogoutButton({ onClick }: { onClick?: () => void }) {
  return <LogoutButtonStyle onClick={onClick}>로그아웃</LogoutButtonStyle>
}

export function GoTo7thButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // 7차 홈 페이지로 이동
      router.push(SITE_PATH.HOME.MAIN)
    }
  }

  return (
    <GoTo7thButtonStyle onClick={handleClick}>
      이전 버전으로 돌아가기
    </GoTo7thButtonStyle>
  )
}
