'use client'

import { Assets } from '@/8th/assets/asset-library'
import DailyGoalCard from '@/8th/features/achieve/ui/component/DailyGoalCard'
import ReadingUnitCard from '@/8th/features/achieve/ui/component/ReadingUnitCard'
import StreakCard, {
  StreakCardClassic,
} from '@/8th/features/achieve/ui/component/StreakCard'
import CalendarModal from '@/8th/features/achieve/ui/modal/CalendarModal'
import { useSearchFavoriteBook } from '@/8th/features/library/service/search-query'
import { usePointRank } from '@/8th/features/rank/service/rank-query'
import { useHistoryReadingInfinite } from '@/8th/features/review/service/history-query'
import {
  useChangeStudyLearningLevel,
  useContinuousStudy,
  useStudentDailyLearning,
  useTodayStudyLearning,
} from '@/8th/features/student/service/learning-query'
import { useStudentAvatarList } from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import StudentProfileCard from '@/8th/features/student/ui/component/StudentProfileCard'
import { useTodoList } from '@/8th/features/todo/service/todo-query'
import {
  BasicGridLayoutStyle,
  LeftContainerStyle,
  MenuItemStyle,
  MobileTopPlaceholderStyle,
  RightContainerStyle,
} from '@/8th/shared/styled/SharedStyled'
import SITE_PATH from '@/app/site-path'
import DateUtils from '@/util/date-utils'
import NumberUtils from '@/util/number-utils'
import Image, { StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// 페이지 타입별 제목 및 아이콘 매핑
const PAGE_CONFIG = {
  [SITE_PATH.NW82.DAILY_RG]: {
    title: 'DAILY RG',
    icon: Assets.Icon.Gnb.main,
  },
  [SITE_PATH.NW82.EB]: {
    title: 'E-BOOKS',
    icon: Assets.Icon.Gnb.ebooks,
  },
  [SITE_PATH.NW82.PB]: {
    title: 'PB',
    icon: Assets.Icon.Gnb.bookQuiz,
  },
  [SITE_PATH.NW82.ACTIVITY]: {
    title: 'MY ACTIVITY',
    icon: Assets.Icon.Gnb.myActivity,
  },
} as const

/**
 * 기본 그리드 레이아웃
 */
export default function BasicGridLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isRightContainerOpen, setIsRightContainerOpen] = useState(false)

  let header: { title: string; icon: StaticImageData } | null = null
  if (pathname.endsWith(SITE_PATH.NW82.DAILY_RG)) {
    header = PAGE_CONFIG[SITE_PATH.NW82.DAILY_RG]
  } else if (pathname.endsWith(SITE_PATH.NW82.EB)) {
    header = PAGE_CONFIG[SITE_PATH.NW82.EB]
  } else if (pathname.endsWith(SITE_PATH.NW82.PB)) {
    header = PAGE_CONFIG[SITE_PATH.NW82.PB]
  } else if (pathname.endsWith(SITE_PATH.NW82.ACTIVITY)) {
    header = PAGE_CONFIG[SITE_PATH.NW82.ACTIVITY]
  }
  useEffect(() => {
    if (header === null) {
      setIsRightContainerOpen(false)
    }
  }, [header])

  return (
    <>
      {header && <MobileTopPlaceholderStyle />}
      <BasicGridLayoutStyle>
        <LeftContainer
          header={header}
          onCalendarClick={() => setIsCalendarModalOpen(true)}
          onProfileClick={() => setIsRightContainerOpen(true)}>
          {children}
        </LeftContainer>
        <RightContainer
          isRightContainerOpen={isRightContainerOpen}
          handleCloseRightContainer={() =>
            setIsRightContainerOpen(false)
          }></RightContainer>
      </BasicGridLayoutStyle>

      {/* 모달 */}
      {isCalendarModalOpen && (
        <CalendarModal onCloseModal={() => setIsCalendarModalOpen(false)} />
      )}
    </>
  )
}

function LeftContainer({
  children,
  header = null,
  onCalendarClick,
  onProfileClick,
}: {
  children?: React.ReactNode
  header?: { title: string; icon: StaticImageData } | null
  onCalendarClick: () => void
  onProfileClick: () => void
}) {
  const avatar = useStudentAvatarList()
  const myAvatar = avatar.data?.list.find(
    (item) => item.avatarId === avatar.data?.avatarId,
  )

  return (
    <LeftContainerStyle leftContainerGap={25}>
      {header && (
        <div className="left-container-title-box">
          <div className="title" onClick={() => window.location.reload()}>
            <Image
              src={header.icon}
              alt={header.title.toLowerCase().replace(' ', '-')}
              width={38}
              height={38}
            />
            {header.title}
          </div>
          <div className="menu">
            <MenuItemStyle onClick={onCalendarClick}>
              <Image
                src={Assets.Icon.Gnb.calendar}
                alt="DAILY RG"
                width={34}
                height={34}
              />
            </MenuItemStyle>
            <MenuItemStyle onClick={onProfileClick}>
              <Image
                src={myAvatar?.imageCircle || ''}
                alt={myAvatar?.name || ''}
                width={34}
                height={34}
              />
            </MenuItemStyle>
          </div>
        </div>
      )}
      {children}
    </LeftContainerStyle>
  )
}

function RightContainer({
  isRightContainerOpen,
  handleCloseRightContainer,
  children,
}: {
  isRightContainerOpen?: boolean
  handleCloseRightContainer?: () => void
  children?: React.ReactNode
}) {
  const student = useStudent()
  const continuousStudy = useContinuousStudy()
  const todayLearning = useTodayStudyLearning()
  const dailyLearning = useStudentDailyLearning()
  const todo = useTodoList()
  const favorite = useSearchFavoriteBook({ status: 'All' })
  const avatar = useStudentAvatarList()
  const myAvatar =
    avatar.data?.list.find((item) => item.avatarId === avatar.data?.avatarId)
      ?.imageCircle || ''
  const rank = usePointRank({ type: 'total' })
  const myRank = rank.data?.user ? rank.data.user.totalRank : 0
  const todayText = DateUtils.toStringDate(new Date(), {
    divide: '',
    digitfix: true,
  })
  const latestHistory = useHistoryReadingInfinite({
    startDate: todayText,
    endDate: todayText,
    status: 'All',
    page: 1,
  })
  const { mutate: changeStudyLevel } = useChangeStudyLearningLevel()

  const [recommendLevel, setRecommendLevel] = useState({
    level: '',
    visible: false,
  })

  if (
    latestHistory.data &&
    latestHistory.data.pages.length > 0 &&
    latestHistory.data.pages[0].history.length > 0 &&
    dailyLearning.data &&
    !dailyLearning.data.settingLevelName
    // dailyLearning.data.settingLevelName === '2A'
  ) {
    // TODO:: 레벨이력 영구 저장 필요 ... 추후 구현
    // FIXME:: 하드코딩 데이터 제거
    // const historyLevel =
    //   latestHistory.data.pages[0].history[0].levelName.substring(3, 5)
    const historyLevel = '2C'
    if (historyLevel && recommendLevel.level !== historyLevel) {
      setRecommendLevel({
        level: historyLevel,
        visible: true,
      })
    }
  }
  useEffect(() => {
    if (recommendLevel.level && recommendLevel.visible) {
      if (
        confirm(
          `학습을 성공적으로 완료하셨습니다. 방금 학습한 ${recommendLevel.level} 레벨을 이후 진행할 학습 레벨로 설정하시겠습니까?`,
        )
      ) {
        changeStudyLevel(recommendLevel.level)
      }
      setRecommendLevel({
        level: recommendLevel.level,
        visible: false,
      })
    }
  }, [changeStudyLevel, recommendLevel.visible, recommendLevel.level])

  const point = student.data?.student?.rgPoint || 0
  const isStreakLegacyMode = continuousStudy.data?.continuousViewType === '6'
  const isTodayStudy = continuousStudy.data?.todayStudyYn || false
  const streakCount = continuousStudy.data?.continuous || 0
  const dailyType = (dailyLearning.data?.settingType || 'Points') as
    | 'Points'
    | 'Books'
  const dailyValue =
    (dailyType === 'Points'
      ? todayLearning.data?.point
      : todayLearning.data?.books) || 0
  const dailyGoalValue =
    (dailyType === 'Points'
      ? dailyLearning.data?.point
      : dailyLearning.data?.books) || 0

  return (
    <>
      <RightContainerStyle className={isRightContainerOpen ? 'active' : ''}>
        <div
          className="right-container-close-button"
          onClick={handleCloseRightContainer}>
          <Image
            src={Assets.Icon.deleteBlack}
            alt="CLOSE"
            width={24}
            height={24}
          />
        </div>
        <StudentProfileCard
          studentName={student.data?.student?.name || ''}
          avatar={myAvatar}
          level={dailyLearning.data?.settingLevelName || ''}
          rank={myRank}
          book={student.data?.student?.brCount || 0}
          point={NumberUtils.toRgDecimalPoint(
            student.data?.student?.rgPoint || 0,
          )}
          todo={todo.data?.count || 0}
          favorite={favorite.data?.page.totalRecords || 0}
        />
        {isStreakLegacyMode ? (
          <StreakCardClassic
            isTodayStudy={isTodayStudy}
            streakCount={streakCount}
          />
        ) : (
          <StreakCard isTodayStudy={isTodayStudy} streakCount={streakCount} />
        )}
        <DailyGoalCard
          currentValue={dailyValue}
          settingValue={dailyGoalValue}
          settingType={dailyType}
        />
        <ReadingUnitCard point={point} />
        {children}
      </RightContainerStyle>

      {isRightContainerOpen && (
        <div
          className="right-container-overlay"
          onClick={handleCloseRightContainer}
        />
      )}
    </>
  )
}
