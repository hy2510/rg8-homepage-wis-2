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
import LevelGuidancePopup from '@/8th/features/student/ui/modal/LevelGuidancePopup'
import { useTodoList } from '@/8th/features/todo/service/todo-query'
import AuthContextProvider from '@/8th/shared/auth/AuthContext'
import { GuardStudent } from '@/8th/shared/auth/GuardAuth'
import ScreenModeContextProvider, {
  useIsDesktop,
} from '@/8th/shared/context/ScreenModeContext'
import ReactQueryProvider from '@/8th/shared/react-query/ReactQueryProvider'
import {
  BasicGridLayoutStyle,
  BodyContainerStyle,
  ContentsWrapperStyle,
  LeftContainerStyle,
  MenuItemStyle,
  MobileTopPlaceholderStyle,
  RightContainerStyle,
} from '@/8th/shared/styled/SharedStyled'
import { GoTo7thButton, LogoutButton } from '@/8th/shared/ui/Buttons'
import FooterMenu from '@/8th/shared/ui/FooterMenu'
import GlobalNavBar from '@/8th/shared/ui/GlobalNavBar'
import SITE_PATH from '@/app/site-path'
import DateUtils from '@/util/date-utils'
import NumberUtils from '@/util/number-utils'
import Image, { StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RootLayout({
  isStudentLogin,
  isStaffLogin,
  children,
}: {
  isStudentLogin: boolean
  isStaffLogin: boolean
  children: React.ReactNode
}) {
  // // 시작페이지가 없어서 api 요청 멈추도록 하는 임시 상태 지정.
  // // 없으면 로그오프 이후에 계속 무한 refresh 발생.
  // const [isLoggedOut, setIsLoggedOut] = useState(false)
  // const router = useRouter()

  // const logout = useLogout({
  //   onSettled: () => {
  //     router.replace('/8th')
  //     setIsLoggedOut(true)
  //   },
  // })
  // useEffect(() => {
  //   registRejectRefreshToken(() => {
  //     console.log('refresh Reject event')
  //     logout.mutate({})
  //   })
  //   return () => {
  //     unregistRejectRefreshToken()
  //   }
  // }, [logout])

  return (
    <ReactQueryProvider>
      <ScreenModeContextProvider>
        <AuthContextProvider
          studentLogin={isStudentLogin}
          staffLogin={isStaffLogin}>
          <GuardStudent redirectTo={SITE_PATH.ACCOUNT.MAIN}>
            <MainLayout>{children}</MainLayout>
          </GuardStudent>
        </AuthContextProvider>
      </ScreenModeContextProvider>
    </ReactQueryProvider>
  )
}

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
    title: 'P-BOOK QUIZ',
    icon: Assets.Icon.Gnb.bookQuiz,
  },
  [SITE_PATH.NW82.ACTIVITY]: {
    title: 'MY ACTIVITY',
    icon: Assets.Icon.Gnb.myActivity,
  },
} as const

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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

  let leftContainerGap = 25
  if (
    pathname.endsWith(SITE_PATH.NW82.DAILY_RG) ||
    pathname.endsWith(SITE_PATH.NW82.DAILY_RESULT)
  ) {
    leftContainerGap = 5
  }

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [isRightContainerOpen, setIsRightContainerOpen] = useState(false)

  /// right container
  const student = useStudent()
  const continuousStudy = useContinuousStudy()
  const todayLearning = useTodayStudyLearning()
  const dailyLearning = useStudentDailyLearning()
  const todo = useTodoList()
  const favorite = useSearchFavoriteBook({ status: 'All' })
  const avatar = useStudentAvatarList()
  const myAvatar = avatar.data?.list.find(
    (item) => item.avatarId === avatar.data?.avatarId,
  )

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

  const isDesktop = useIsDesktop()

  // 레벨 가이던스 팝업 열기
  const [isLevelGuidancePopupOpen, setIsLevelGuidancePopupOpen] = useState(true)

  return (
    <>
      <GlobalNavBar />
      <BodyContainerStyle>
        <ContentsWrapperStyle>
          {header && <MobileTopPlaceholderStyle />}
          <BasicGridLayoutStyle>
            <LeftContainerStyle leftContainerGap={leftContainerGap}>
              {header && (
                <div className="left-container-title-box">
                  <div
                    className="title"
                    onClick={() => window.location.reload()}>
                    <Image
                      src={header.icon}
                      alt={header.title.toLowerCase().replace(' ', '-')}
                      width={38}
                      height={38}
                    />
                    {header.title}
                  </div>
                  <div className="menu">
                    <MenuItemStyle onClick={() => setIsCalendarModalOpen(true)}>
                      <Image
                        src={Assets.Icon.Gnb.calendar}
                        alt="DAILY RG"
                        width={34}
                        height={34}
                      />
                    </MenuItemStyle>
                    <MenuItemStyle
                      onClick={() => setIsRightContainerOpen(true)}>
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

            <RightContainerStyle
              className={isRightContainerOpen && !isDesktop ? 'active' : ''}>
              <div
                className="right-container-close-button"
                onClick={() => setIsRightContainerOpen(false)}>
                <Image
                  src={Assets.Icon.deleteBlack}
                  alt="CLOSE"
                  width={24}
                  height={24}
                />
              </div>
              <StudentProfileCard
                studentName={student.data?.student?.name || ''}
                avatar={myAvatar?.imageCircle || ''}
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
                <StreakCard
                  isTodayStudy={isTodayStudy}
                  streakCount={streakCount}
                />
              )}
              <DailyGoalCard
                currentValue={dailyValue}
                settingValue={dailyGoalValue}
                settingType={dailyType}
              />
              <ReadingUnitCard point={point} />
              <LogoutButton />
              <GoTo7thButton />
            </RightContainerStyle>

            {isRightContainerOpen && !isDesktop && (
              <div
                className="right-container-overlay"
                onClick={() => setIsRightContainerOpen(false)}
              />
            )}
          </BasicGridLayoutStyle>

          {/* 모달 */}
          {isCalendarModalOpen && (
            <CalendarModal onCloseModal={() => setIsCalendarModalOpen(false)} />
          )}
          {isLevelGuidancePopupOpen && (
            <LevelGuidancePopup onCloseModal={() => {}} />
          )}
        </ContentsWrapperStyle>
        <FooterMenu />
      </BodyContainerStyle>
    </>
  )
}
