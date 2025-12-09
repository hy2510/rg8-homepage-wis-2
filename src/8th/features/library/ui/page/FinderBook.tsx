'use client'

import { useLevelBooks } from '@/8th/features/achieve/service/achieve-query'
import {
  useCategoryContinue,
  useCategorySeries,
} from '@/8th/features/library/service/library-query'
import ChallengeBoard from '@/8th/features/library/ui/component/ChallengeBoard'
import Collections from '@/8th/features/library/ui/component/Collections'
import ContinueViewed from '@/8th/features/library/ui/component/ContinueViewed'
import LevelSection from '@/8th/features/library/ui/component/LevelSection'
import SearchBar from '@/8th/features/library/ui/component/SearchBar'
import {
  LevelSectionType,
  makeLevelItem,
  makeLevelItemPK,
  makeLevelSectionSeries,
  makeLevelSectionSeriesItem,
  makeLevelSectionType,
  makeLevelSectionTypeDodoABC,
  makeLevelSectionTypePK,
} from '@/8th/features/library/ui/levelSectionData'
import {
  useReadingKingEventDetail,
  useReadingKingEventList,
  useReadingKingEventPrize,
  useReadingKingEventPrizeUpdate,
} from '@/8th/features/readingking/service/readingking-query'
import {
  useStudentDailyLearning,
  useTodayStudyLearning,
} from '@/8th/features/student/service/learning-query'
import DateUtils from '@/util/date-utils'
import LevelUtils from '@/util/level-utils'
import { useMemo } from 'react'

export default function FinderBook({ booktype }: { booktype: string }) {
  const userSetting = useStudentDailyLearning()
  const todayLearning = useTodayStudyLearning()
  const levels = useLevelBooks()
  const seriesCategory = useCategorySeries({
    bookType: booktype.toUpperCase() as 'EB' | 'PB',
  })
  const continueCategory = useCategoryContinue()

  const readingKingEvent = useReadingKingEventList()
  const { mutate: changeEventPrize } = useReadingKingEventPrizeUpdate()

  let targetEventId = undefined
  if (readingKingEvent.data && readingKingEvent.data.list.length > 0) {
    const latestEvent = readingKingEvent.data.list[0]
    const dateRange = DateUtils.rangeDayCheck(
      DateUtils.createDate(latestEvent.startDate),
      DateUtils.createDate(latestEvent.endDate),
      new Date(),
    )
    if (-2 < dateRange && dateRange < 2) {
      targetEventId = latestEvent.eventId
    }
  }
  const userReadingking = useReadingKingEventDetail(
    {
      eventId: targetEventId!,
    },
    { enabled: !!targetEventId },
  )
  const eventPrizeList = useReadingKingEventPrize(
    {
      eventId: targetEventId!,
    },
    { enabled: !!targetEventId },
  )

  const findBookData: {
    sectionData: LevelSectionType[]
    continueSection?: LevelSectionType
    defaultOpenSection?: string
  } = useMemo(() => {
    if (
      !booktype ||
      !levels.data ||
      !seriesCategory.data ||
      !userSetting.data ||
      !continueCategory.data
    ) {
      return {
        sectionData: [],
      }
    }
    const userLevel = userSetting.data?.settingLevelName

    let containLevelGroup = undefined
    const lSectionData: LevelSectionType[] = []
    let continueLevel = undefined
    let continueSeries = undefined

    if (booktype === 'eb') {
      const dodoAbcData = makeLevelSectionTypeDodoABC(
        levels.data?.dodoABC || [],
      )
      const pkData = makeLevelSectionTypePK(levels.data?.preK || [])
      if (pkData) {
        lSectionData.push(pkData)
      }
      if (dodoAbcData) {
        lSectionData.push(dodoAbcData)
      }
      if (userLevel === 'PK') {
        if (dodoAbcData) {
          containLevelGroup = dodoAbcData.section
        } else if (pkData) {
          containLevelGroup = pkData.section
        }
      }

      const ebData = levels.data?.eb || []

      const lvKTo1Data = makeLevelSectionType('Kto1', 'eb', ebData)
      if (lvKTo1Data) {
        const seriesData = makeLevelSectionSeries(
          'eb',
          'KA',
          '1C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lvKTo1Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lvKTo1Data)
        if (LevelUtils.isContainLevel(userLevel, 'KA', '1C')) {
          containLevelGroup = lvKTo1Data.section
        }
      }
      const lv2To3Data = makeLevelSectionType('2to3', 'eb', ebData)
      if (lv2To3Data) {
        const seriesData = makeLevelSectionSeries(
          'eb',
          '2A',
          '3C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lv2To3Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lv2To3Data)
        if (LevelUtils.isContainLevel(userLevel, '2A', '3C')) {
          containLevelGroup = lv2To3Data.section
        }
      }
      const lv4To6Data = makeLevelSectionType('4to6', 'eb', ebData)
      if (lv4To6Data) {
        const seriesData = makeLevelSectionSeries(
          'eb',
          '4A',
          '6C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lv4To6Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lv4To6Data)
        if (LevelUtils.isContainLevel(userLevel, '4A', '6C')) {
          containLevelGroup = lv4To6Data.section
        }
      }

      const continueLevelData = continueCategory.data?.continue?.eb?.level
      const continueSeriesData = continueCategory.data?.continue?.eb?.series

      if (continueLevelData) {
        if (continueLevelData.startsWith('PK')) {
          let findContinueLevel = undefined
          findContinueLevel = levels.data?.dodoABC?.find(
            (level) => level.levelName === continueLevelData,
          )
          if (findContinueLevel) {
            continueLevel = makeLevelItemPK('dodoabc', findContinueLevel)
          } else {
            findContinueLevel = levels.data?.preK?.find(
              (level) => level.levelName === continueLevelData,
            )
            if (findContinueLevel) {
              continueLevel = makeLevelItemPK('pk', findContinueLevel)
            }
          }
        } else {
          const findContinueLevel = levels.data?.eb?.find(
            (level) => level.levelName === continueLevelData,
          )
          if (!!findContinueLevel) {
            continueLevel = makeLevelItem('eb', findContinueLevel)
          }
        }
      }
      if (!!continueSeriesData) {
        const findContinueSeries = continueSeriesData
          ? seriesCategory.data?.category?.find(
              (series) => series.name === continueSeriesData,
            )
          : undefined
        if (!!findContinueSeries) {
          continueSeries = makeLevelSectionSeriesItem('eb', findContinueSeries)
        }
      }
    } else if (booktype === 'pb') {
      const pbData = levels.data?.pb || []

      const lvKTo1Data = makeLevelSectionType('Kto1', 'pb', pbData)
      if (lvKTo1Data) {
        const seriesData = makeLevelSectionSeries(
          'pb',
          'KC',
          '1C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lvKTo1Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lvKTo1Data)
        if (LevelUtils.isContainLevel(userLevel, 'KC', '1C')) {
          containLevelGroup = lvKTo1Data.section
        }
      }
      const lv2To3Data = makeLevelSectionType('2to3', 'pb', pbData)
      if (lv2To3Data) {
        const seriesData = makeLevelSectionSeries(
          'pb',
          '2A',
          '3C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lv2To3Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lv2To3Data)
        if (LevelUtils.isContainLevel(userLevel, '2A', '3C')) {
          containLevelGroup = lv2To3Data.section
        }
      }
      const lv4To6Data = makeLevelSectionType('4to6', 'pb', pbData)
      if (lv4To6Data) {
        const seriesData = makeLevelSectionSeries(
          'pb',
          '4A',
          '6C',
          seriesCategory.data.category,
        )
        if (seriesData.length > 0) {
          lv4To6Data.series = [{ items: seriesData }]
        }
        lSectionData.push(lv4To6Data)
        if (LevelUtils.isContainLevel(userLevel, '4A', '6C')) {
          containLevelGroup = lv4To6Data.section
        }
      }

      const continueLevelData = continueCategory.data?.continue?.pb?.level
      const continueSeriesData = continueCategory.data?.continue?.pb?.series

      if (continueLevelData) {
        const findContinueLevel = levels.data?.eb?.find(
          (level) => level.levelName === continueLevelData,
        )
        if (!!findContinueLevel) {
          continueLevel = makeLevelItem('pb', findContinueLevel)
        }
      }
      if (!!continueSeriesData) {
        const findContinueSeries = continueSeriesData
          ? seriesCategory.data?.category?.find(
              (series) => series.name === continueSeriesData,
            )
          : undefined
        if (!!findContinueSeries) {
          continueSeries = makeLevelSectionSeriesItem('eb', findContinueSeries)
        }
      }
    }

    const continueSectionResult: LevelSectionType | undefined =
      !!continueLevel || !!continueSeries
        ? {
            section: 'Continue',
            levels: [{ items: continueLevel ? [continueLevel] : [] }],
            series: [{ items: continueSeries ? [continueSeries] : [] }],
          }
        : undefined

    return {
      sectionData: lSectionData,
      continueSection: continueSectionResult,
      defaultOpenSection: containLevelGroup,
    }
  }, [
    booktype,
    levels.data,
    seriesCategory.data,
    userSetting.data,
    continueCategory.data,
  ])

  if (levels.isLoading || seriesCategory.isLoading || userSetting.isLoading) {
    return <div />
  }
  if (
    readingKingEvent.isLoading ||
    userReadingking.isLoading ||
    eventPrizeList.isLoading ||
    todayLearning.isLoading
  ) {
    return <div />
  }
  const isTodayStudy = todayLearning.data
    ? todayLearning.data.books > 0 || todayLearning.data.point > 0
    : false

  const onReadingKingPrizeChange = (prizeId: string) => {
    changeEventPrize({ eventId: targetEventId!, eventPrizeId: prizeId })
  }

  return (
    <>
      {!!targetEventId && userReadingking.data && (
        <ChallengeBoard
          title={userReadingking.data.eventTitle}
          startDate={userReadingking.data.startDate}
          endDate={userReadingking.data.endDate}
          prize={userReadingking.data.eventPrizeId}
          point={userReadingking.data.totalPoint}
          learningDays={userReadingking.data.totalReadingDays}
          isTodayStudy={isTodayStudy}
          prizeList={eventPrizeList.data?.list || []}
          onPrizeChange={onReadingKingPrizeChange}
        />
      )}
      <SearchBar booktype={booktype as 'eb' | 'pb'} />
      {findBookData.continueSection && (
        <ContinueViewed continueSection={findBookData.continueSection} />
      )}
      <LevelSection
        levelSection={findBookData.sectionData}
        defaultLevel={findBookData.defaultOpenSection}
      />
      <Collections bookType={booktype as 'eb' | 'pb'} />
    </>
  )
}
