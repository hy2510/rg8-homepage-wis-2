'use client'

import { Assets } from '@/8th/assets/asset-library'
import { BookItemStyle } from '@/8th/shared/styled/FeaturesStyled'
import CustomCheckbox from '@/8th/shared/ui/CustomCheckbox'
import NumberUtils from '@/util/number-utils'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'

/**
 * 도서 표지 및 기타정보
 */

export interface BookItemProps {
  title: string
  passCount: number
  point: number
  addYn: boolean
  movieYn: boolean
  src: string
  levelName: string
  isCheckable?: boolean
  isChecked?: boolean
  disabled?: boolean
  inProgressIcon?: StaticImageData
  onClick?: () => void
}

export default function BookItem({
  title,
  passCount,
  point,
  addYn,
  movieYn,
  src,
  levelName,
  isCheckable,
  isChecked,
  disabled,
  inProgressIcon = Assets.Icon.Study.inProgressMark,
  onClick,
}: BookItemProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyTitleClipboard = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(title)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {}
    } else {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = title
        textarea.style.position = 'fixed'
        textarea.style.left = '-999999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)

        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {}
    }
  }

  return (
    <>
      <BookItemStyle level={'level'}>
        <div
          className="book-cover-container"
          onClick={() => {
            if (onClick) {
              onClick()
            }
          }}>
          <div className="book-cover-wrapper">
            <Image
              src={src}
              alt="book"
              width={140}
              height={200}
              className="book-cover"
            />
            {isCheckable && (
              <div
                className="check-box-position animate__animated animate__bounce"
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled && onClick) {
                    onClick()
                  }
                }}>
                <CustomCheckbox
                  id="book-item-checkbox"
                  checked={isChecked}
                  disabled={disabled}
                  onChange={(checked) => {
                    if (!disabled && onClick) {
                      onClick()
                    }
                  }}
                />
              </div>
            )}
            <div className="badges">
              {/* To-Do에 추가된 도서 */}
              {addYn && (
                <Image
                  src={inProgressIcon}
                  alt="badge"
                  width={40}
                  height={40}
                />
              )}
              {/* 1회차 완료시 */}
              {passCount === 1 && (
                <Image
                  src={Assets.Icon.Study.checkMarkGold}
                  alt="badge"
                  width={40}
                  height={40}
                />
              )}
              {/* 2회 이상 완료시 */}
              {passCount >= 2 && (
                <Image
                  src={Assets.Icon.Study.checkMarkGoldTwin}
                  alt="badge"
                  width={70}
                  height={40}
                />
              )}
            </div>
            {movieYn && (
              <div className="movie-icon">
                <Image
                  src={Assets.Icon.playRed}
                  alt="badge"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </div>
        </div>
        <div className="book-code-container">
          <div className="book-code">{levelName}</div>
          <div
            className="book-code-bg"
            style={{ backgroundImage: `url(${src})` }}></div>
        </div>
        <div
          className="book-info-container"
          onClick={(e) => {
            e.stopPropagation()
            copyTitleClipboard()
          }}>
          <div className="wrapper">
            <div className="title">{isCopied ? 'Copied!' : title}</div>
            {point > 0 && (
              <div className="point">
                {NumberUtils.toRgDecimalPoint(point)}P
              </div>
            )}
          </div>
        </div>
      </BookItemStyle>
    </>
  )
}

export function SkeletonBookItem() {
  return (
    <BookItemStyle level={'level'}>
      <div className="book-cover-container">
        <div className="book-cover-skeleton" />
      </div>
      <div className="book-info-container">
        <div className="wrapper">
          <div className="title-skeleton" />
          <div className="gap" />
          <div className="point-skeleton" />
        </div>
      </div>
    </BookItemStyle>
  )
}
