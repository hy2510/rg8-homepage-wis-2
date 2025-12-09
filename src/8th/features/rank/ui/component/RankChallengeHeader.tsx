'use client'

import { BoxStyle, SelectBox, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import DateUtils from '@/util/date-utils'

/**
 * 영어독서왕 헤더
 */
export default function RankChallengeHeader({
  events,
  onChangeOption,
}: {
  events: {
    key: string
    title: string
    startDate: string
    endDate: string
    isActive: boolean
  }[]
  onChangeOption?: (key: string) => void
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const selectedEvent = events.find((event) => event.isActive)
  let eventDate: string | undefined = undefined
  if (selectedEvent) {
    const eventStartDate = DateUtils.createDate(selectedEvent.startDate)
    const eventEndDate = DateUtils.createDate(selectedEvent.endDate)
    eventDate = `대회 기간: ${eventStartDate.getMonth() + 1}/${eventStartDate.getDate()} ~ ${eventEndDate.getMonth() + 1}/${eventEndDate.getDate()} `
  }

  return (
    <BoxStyle
      display="flex"
      flexDirection="column"
      gap={5}
      padding="0 0 0 10px">
      <BoxStyle display="flex" gap={10} alignItems="center">
        <SelectBox
          selectedValue={selectedEvent?.title || ''}
          onChange={(value) => {
            const selectEvent = events.find((item) => item.title === value)?.key

            if (selectEvent !== undefined) {
              if (onChangeOption) {
                onChangeOption(selectEvent)
              }
            }
          }}
          options={events.map((item) => item.title)}
        />
      </BoxStyle>
      {eventDate && (
        <TextStyle
          fontColor="secondary"
          fontFamily="sans"
          fontSize="small"
          fontWeight={500}>
          {eventDate}
        </TextStyle>
      )}
      <TextStyle
        fontColor="secondary"
        fontFamily="sans"
        fontSize="small"
        fontWeight={500}>
        오늘 학습한 기록은 내일 오전에 반영됩니다.
      </TextStyle>
    </BoxStyle>
  )
}
