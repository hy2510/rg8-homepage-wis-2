'use client'

import { StudyStatusViewStyle } from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'

/**
 * 남은학습일, ... 결제하기 버튼
 */

interface StudyStatusViewProps {
  remainingStudyPeriod: number
  endStudyDate?: string
}

export default function StudyStatusView({
  remainingStudyPeriod,
  endStudyDate,
}: StudyStatusViewProps) {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <StudyStatusViewStyle>
      <BoxStyle display="flex" gap={10}>
        <TextStyle fontFamily="sans" type="span" fontSize="medium">
          {t('t8th093')}
        </TextStyle>
        <TextStyle
          fontFamily="sans"
          fontWeight={'bolder'}
          type="span"
          fontSize="medium">
          {remainingStudyPeriod}
          {remainingStudyPeriod > 1
            ? ' days'
            : remainingStudyPeriod === 0
              ? ''
              : ' day'}
        </TextStyle>
      </BoxStyle>
      <BoxStyle display="flex" gap={10}>
        <TextStyle fontFamily="sans" type="span" fontSize="medium">
          {t('t8th094')}
        </TextStyle>
        <TextStyle
          fontFamily="sans"
          fontWeight={'bolder'}
          type="span"
          fontSize="medium">
          {endStudyDate}
        </TextStyle>
        <TextStyle
          fontFamily="sans"
          fontWeight={'bold'}
          fontColor="lightBlue"
          fontSize="medium"
          type="span"
          onClick={() => {}}>
          {t('t8th095')}
        </TextStyle>
      </BoxStyle>
    </StudyStatusViewStyle>
  )
}
