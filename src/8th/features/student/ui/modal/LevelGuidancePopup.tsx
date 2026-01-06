'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useStudentDailyLearning } from '@/8th/features/student/service/learning-query'
import { BookInfoModalStyle } from '@/8th/shared/styled/FeaturesStyled'
import CustomCheckbox from '@/8th/shared/ui/CustomCheckbox'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import { MiniModalContainer } from '@/8th/shared/ui/Modal'
import Image from 'next/image'
import { useState } from 'react'

interface LevelGuidancePopupProps {
  onCloseModal: () => void
  onConfirm?: () => void
  onDontShowAgain?: (checked: boolean) => void
}

/**
 * 레벨 가이던스 안내 작업 팝업
 */
export default function LevelGuidancePopup({
  onCloseModal,
  onConfirm,
  onDontShowAgain,
}: LevelGuidancePopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    if (onDontShowAgain && dontShowAgain) {
      onDontShowAgain(true)
    }
    onCloseModal()
  }

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked)
    if (onDontShowAgain) {
      onDontShowAgain(checked)
    }
  }

  return (
    <BookInfoModalStyle>
      <MiniModalContainer>
        <div className="mini-modal-header">
          <div className="header-title">Level Guidance</div>
          <div className="btn-close" onClick={onCloseModal}>
            <Image
              src={Assets.Icon.deleteBlack}
              alt="close"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="mini-modal-body" style={{ minHeight: '200px' }}>
          {/* 메시지 타입에 따라 메시지 내용 변경 */}
          <LevelGuidancePopupMessage type="levelChange" />

          <BoxStyle
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={10}>
            <div />
            <BoxStyle display="flex" gap={10}>
              <TextStyle
                onClick={onCloseModal}
                fontFamily="sans"
                fontSize="large"
                fontWeight="bold"
                fontColor="var(--line-color-light-blue)"
                margin="0 10px 0 0">
                아니오
              </TextStyle>
              <TextStyle
                onClick={handleConfirm}
                fontFamily="sans"
                fontSize="large"
                fontWeight="bold"
                fontColor="var(--color-gray-strong)"
                margin="0 10px 0 0">
                예
              </TextStyle>
            </BoxStyle>
          </BoxStyle>
        </div>
        <BoxStyle
          padding="15px 20px"
          borderTop="1px solid var(--line-color-primary)"
          backgroundColor="#fff">
          <CustomCheckbox
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={handleDontShowAgainChange}
            label="이 안내 그만 보기"
          />
        </BoxStyle>
      </MiniModalContainer>
    </BookInfoModalStyle>
  )
}

function LevelGuidancePopupMessage({
  type,
}: {
  type: 'levelChange' | 'tryOtherLevel'
}) {
  const userSetting = useStudentDailyLearning()
  const currentLevel = userSetting.data?.settingLevelName || ''

  // 최근 학습한 도서의 레벨 가져오기
  const lastBookLevel = 'KA'

  return (
    <BoxStyle display="flex" flexDirection="column" gap={15}>
      <TextStyle fontFamily="sans" fontSize="medium" fontColor="secondary">
        {type === 'levelChange' ? '레벨 변경 안내' : '학습 레벨 자동 설정'}
      </TextStyle>
      <TextStyle fontFamily="sans" fontSize="large" fontColor="primary">
        {type === 'levelChange'
          ? `현재 학습 레벨(${currentLevel})보다 높은 학습입니다. 시작할까요?`
          : `방금 학습한 ${lastBookLevel || ''}를 기본 학습 레벨로 변경할까요?`}
      </TextStyle>
    </BoxStyle>
  )
}
