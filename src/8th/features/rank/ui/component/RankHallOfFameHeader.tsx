'use client'

import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'

/**
 * 명예의전당 헤더
 */
export default function RankHallOfFameHeader() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <BoxStyle
      display="flex"
      flexDirection="column"
      gap={5}
      padding="0 0 0 10px">
      <TextStyle
        fontColor="secondary"
        fontFamily="sans"
        fontSize="small"
        fontWeight={500}>
        {t('t8th244')}
      </TextStyle>
      <TextStyle
        fontColor="lightBlue"
        fontFamily="sans"
        fontSize="small"
        fontWeight={500}>
        {t('t8th245')}
      </TextStyle>
    </BoxStyle>
  )
}
