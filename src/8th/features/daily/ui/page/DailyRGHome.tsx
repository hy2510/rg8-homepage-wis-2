'use client'

import { Assets } from '@/8th/assets/asset-library'
import {
  useDailyBookList,
  useDailySectionList,
  useDailyStageList,
} from '@/8th/features/daily/service/daily-query'
import DailyRGBookItem from '@/8th/features/daily/ui/component/DailyRGBookItem'
import DailyRGLevel from '@/8th/features/daily/ui/component/DailyRGLevel'
import DailyRGSection from '@/8th/features/daily/ui/component/DailyRGSection'
import DailyRGTheme from '@/8th/features/daily/ui/daily-rg-theme'
import { BookDetailInfo } from '@/8th/features/library/model/book-info'
import { useBookDetailInfo } from '@/8th/features/library/service/library-query'
import BookInfoModal from '@/8th/features/library/ui/modal/BookInfoModal'
import PrintVocabularyModal from '@/8th/features/library/ui/modal/PrintVocabularyModal'
import { useStudentDailyLearning } from '@/8th/features/student/service/learning-query'
import {
  useStudent,
  useStudentHistoryList,
} from '@/8th/features/student/service/student-query'
import { useStudyStart } from '@/8th/features/todo/service/todo-query'
import { useIsTabletLarge } from '@/8th/shared/context/ScreenModeContext'
import { VocabularyOption } from '@/8th/shared/hook/useExportPanel'
import useStartStudy from '@/8th/shared/hook/useStartStudy'
import {
  DailyRGCourseListStyle,
  QuickJumpButtonStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { Gap } from '@/8th/shared/ui/Misc'
import { openWindow } from '@/8th/shared/utils/open-window'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export default function DailyRGHome({ stage }: { stage?: string }) {
  const router = useRouter()

  // @Language 'common'
  const { t } = useTranslation()

  const [currentStageId, setCurrentStageId] = useState<
    { stageId: string; levelKey: string } | undefined
  >(undefined)

  const userSetting = useStudentDailyLearning()
  const { data: stageList, isLoading: isStageListLoading } = useDailyStageList()

  const stages: {
    stageId: string
    stageName: string
    levelKey: string
    subName?: string
    subText?: string
  }[] =
    stageList?.list.map((item) => {
      let subText = t('t8th287')
      let stageName = `${item.stageName} (Lv. PK)`
      let levelKey = 'PK'
      if (item.minLevel.startsWith('K')) {
        levelKey = 'K'
        stageName = `${item.stageName} (Lv. K)`
        subText = t('t8th288')
      } else if (item.minLevel.startsWith('1')) {
        levelKey = '1'
        stageName = `${item.stageName} (Lv. 1)`
        subText = t('t8th289')
      } else if (item.minLevel.startsWith('2')) {
        levelKey = '2'
        stageName = `${item.stageName} (Lv. 2)`
        subText = t('t8th290')
      } else if (item.minLevel.startsWith('3')) {
        levelKey = '3'
        stageName = `${item.stageName} (Lv. 3)`
        subText = t('t8th291')
      } else if (
        item.minLevel.startsWith('4') ||
        item.minLevel.startsWith('5') ||
        item.minLevel.startsWith('6')
      ) {
        levelKey = '4'
        stageName = `${item.stageName} (Lv. 4 to 6)`
        subText = t('t8th292')
      }
      return {
        stageId: item.stageId,
        stageName: stageName,
        levelKey: levelKey,
        subName: stageName,
        subText: subText,
      }
    }) || []
  if (
    !currentStageId &&
    !isStageListLoading &&
    !userSetting.isLoading &&
    stages.length > 0
  ) {
    let targetStageId: string | undefined = undefined
    let targetLevelKey: string | undefined = undefined
    if (stage) {
      const targetStage = stages.find((s) => s.stageId === stage)
      if (targetStage) {
        targetStageId = targetStage.stageId
        targetLevelKey = targetStage.levelKey
        setCurrentStageId({
          stageId: targetStageId!,
          levelKey: targetLevelKey!,
        })
      }
    }

    if (!targetStageId || stage !== targetStageId) {
      const userLevel = userSetting.data?.settingLevelName || 'PK'
      targetStageId = stages[0].stageId
      targetLevelKey = stages[0].levelKey

      for (const s of stages) {
        if (userLevel.startsWith(s.levelKey)) {
          targetStageId = s.stageId
          targetLevelKey = s.levelKey
          break
        }
      }
      if (!!targetStageId) {
        setCurrentStageId({
          stageId: targetStageId!,
          levelKey: targetLevelKey!,
        })
        router.replace(`${SITE_PATH.NW82.DAILY_RG}?stage=${targetStageId}`)
      }
    }
  }

  if (!currentStageId || !stageList) {
    return <></>
  }

  return (
    <>
      <DailyRGLevel
        currentStageId={currentStageId.stageId}
        stages={stages}
        onStageChange={(stageId, levelKey) => {
          setCurrentStageId({
            stageId: stageId,
            levelKey: levelKey,
          })
          router.replace(`${SITE_PATH.NW82.DAILY_RG}?stage=${stageId}`)
        }}
      />
      <DailyRGContentList
        stageId={currentStageId.stageId}
        levelKey={currentStageId.levelKey}
      />
    </>
  )
}

function DailyRGContentList({
  stageId,
  levelKey,
}: {
  stageId: string
  levelKey: string
}) {
  const router = useRouter()

  const isTopHeaderVisible = useIsTabletLarge('smaller')

  const student = useStudent()
  const { data: sectionList, isLoading: isSectionListLoading } =
    useDailySectionList({
      stageId,
    })

  let isAllCompleted = false
  let currentSectionId: string | undefined = undefined
  if (sectionList && sectionList.list && sectionList.list.length > 0) {
    for (let i = 0; i < sectionList.list.length; i++) {
      if (!sectionList.list[i].sectionCompleteYn) {
        currentSectionId = sectionList.list[i].sectionId
        break
      }
    }
    if (!currentSectionId) {
      isAllCompleted = true
    }
  }

  const { data: bookList, isLoading: isBookListLoading } = useDailyBookList(
    {
      stageId: stageId,
      sectionId: currentSectionId!,
    },
    {
      enabled: !!currentSectionId,
    },
  )

  let focusBookLevelRoundId: string | undefined = undefined
  let focusBookIndex: number = 0
  if (
    !!currentSectionId &&
    bookList &&
    bookList.book &&
    bookList.book.length > 0
  ) {
    for (let i = 0; i < bookList.book.length; i++) {
      if (bookList.book[i].rgPointCount === 0) {
        focusBookLevelRoundId = bookList.book[i].levelRoundId
        focusBookIndex = i
        break
      }
    }
  }

  const studentHistory = useStudentHistoryList()
  const bookWizardStudentHistoryCount =
    studentHistory.data?.list?.filter((item) => item.isBookWizard).length || 0
  const defaultBookWizardStudentHistoryId =
    bookWizardStudentHistoryCount > 0
      ? studentHistory.data?.list?.filter((item) => item.isBookWizard)[0]
          .studentHistoryId
      : undefined

  const [selectBookInfo, setSelectBookInfo] = useState<
    | {
        levelRoundId: string
        surfaceImagePath: string
        title: string
        bookCode: string
        studentHistoryId?: string
      }
    | undefined
  >(undefined)
  const [selectBookInfoOption, setSelectBookInfoOption] = useState<{
    isShowModal: boolean
    isShowVocaPrintOptions: boolean
    isShowMore: boolean
  }>({
    isShowModal: false,
    isShowVocaPrintOptions: false,
    isShowMore: false,
  })

  const studyStart = useStudyStart({
    onSuccess: (data: {
      type: 'mode' | 'study' | 'speak'
      bookInfo: BookDetailInfo
    }) => {
      if (data.type === 'study') {
        goStudy(data.bookInfo)
      } else if (data.type === 'mode') {
        setSelectBookInfo({
          levelRoundId: data.bookInfo.levelRoundId,
          surfaceImagePath: data.bookInfo.surfaceImage,
          title: data.bookInfo.title,
          bookCode: data.bookInfo.bookCode,
          studentHistoryId: data.bookInfo.studentHistoryId,
        })
        setSelectBookInfoOption({ ...selectBookInfoOption, isShowModal: true })
      }
    },
    onError: (error?: unknown) => {
      if (error && typeof (error as any)?.message === 'string') {
        try {
          const errorPayload = JSON.parse((error as any).message) as {
            message: string
          }
          alert(errorPayload.message)
        } catch (e: unknown) {
          alert('학습 시작 실패 Error')
        }
      }
    },
  })

  const { data: focusBookInfoData } = useBookDetailInfo(
    {
      levelRoundId: focusBookLevelRoundId!,
      studentHistoryId: defaultBookWizardStudentHistoryId!,
    },
    {
      enabled: !!focusBookLevelRoundId && !!defaultBookWizardStudentHistoryId,
    },
  )

  const { data: selectBookInfoData } = useBookDetailInfo(
    {
      levelRoundId: selectBookInfo?.levelRoundId || '',
      studentHistoryId:
        selectBookInfo?.studentHistoryId || defaultBookWizardStudentHistoryId!,
    },
    {
      enabled: !!selectBookInfo && !!defaultBookWizardStudentHistoryId,
    },
  )

  const { onStartStudy } = useStartStudy('quiz')

  const containerRef = useRef<HTMLDivElement>(null)
  const focusCourseRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)
  const [jumpButtonState, setJumpButtonState] = useState<
    'up' | 'down' | undefined
  >('down')

  const [isItemHeightCatched, setItemHeightCatched] = useState(false)

  // stageId, currentSectionId, focusBookLevelRoundId가 변경될 때마다 타겟 위치 재계산을 위해 리셋
  useLayoutEffect(() => {
    const prevScrollRestoreVal = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    // 스크롤을 맨 위로 이동시키지 않고, 타겟 위치로 이동하도록 함
    setItemHeightCatched(false)

    return () => {
      window.history.scrollRestoration = prevScrollRestoreVal
    }
  }, [stageId, currentSectionId, focusBookLevelRoundId])

  const currentTargetInfo = useMemo(() => {
    if (!isItemHeightCatched) {
      return undefined
    }

    const element = focusTargetRef.current
    if (!element) {
      return undefined
    }

    const elementBox = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)

    // 타겟 요소의 절대 위치 (절대 상단 위치)
    const targetElementTop = window.scrollY + elementBox.top

    // 아이템 박스의 높이 (마진 포함)
    const boxHeight =
      elementBox.height +
      (parseInt(style.marginTop ?? '0') ?? 0) +
      (parseInt(style.marginBottom ?? '0') ?? 0)

    // 타겟 요소의 절대 중앙 위치
    const targetElementCenter = targetElementTop + boxHeight / 2

    // 화면 정중앙에 오도록 스크롤 위치 계산
    // 화면 중앙 = window.innerHeight / 2
    // 스크롤 위치 = 타겟 요소 중앙 - 화면 중앙
    const moveYCenter = targetElementCenter - window.innerHeight / 2

    return {
      itemHeight: boxHeight,
      destinationY: moveYCenter,
    }
  }, [isItemHeightCatched])

  const moveToFocusTarget = useCallback(
    (behavior: 'instant' | 'smooth' | 'none') => {
      if (behavior === 'none' || !currentTargetInfo?.destinationY) {
        return
      }
      window.scrollTo({
        top: currentTargetInfo.destinationY,
        behavior: behavior,
      })
    },
    [currentTargetInfo?.destinationY],
  )

  useEffect(() => {
    if (
      focusTargetRef.current &&
      currentTargetInfo?.destinationY !== undefined &&
      !isBookListLoading &&
      !isSectionListLoading
    ) {
      // 이미지 로드 후 DOM이 완전히 렌더링되도록 여러 프레임 대기
      const timeoutId = setTimeout(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            moveToFocusTarget('instant')
          })
        })
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [
    moveToFocusTarget,
    currentTargetInfo?.destinationY,
    isBookListLoading,
    isSectionListLoading,
  ])

  useEffect(() => {
    if (!currentTargetInfo?.itemHeight || !currentTargetInfo?.destinationY) {
      return
    }
    const scrollWather = () => {
      const itemHeight = currentTargetInfo?.itemHeight || 0
      const destinationY = currentTargetInfo?.destinationY || 0
      const scrollY = window.scrollY
      if (scrollY < destinationY - itemHeight * 1.5) {
        if (jumpButtonState !== 'down') {
          setJumpButtonState('down')
        }
      } else if (scrollY > destinationY + itemHeight * 1.5) {
        if (jumpButtonState !== 'up') {
          setJumpButtonState('up')
        }
      } else {
        if (jumpButtonState !== undefined) {
          setJumpButtonState(undefined)
        }
      }
    }
    window.addEventListener('scroll', scrollWather, { passive: true })
    return () => {
      window.removeEventListener('scroll', scrollWather)
    }
  }, [
    jumpButtonState,
    currentTargetInfo?.itemHeight,
    currentTargetInfo?.destinationY,
  ])

  if (isSectionListLoading || isBookListLoading) {
    return <></>
  }

  // TODO: 학습이 가능한 경우에만 열리도록 하는 기능이 필요.
  const isStudyEnd = student?.data?.studyState?.isStudyEnd || false
  const onStudyEndMessage = () => {
    const message = student?.data?.studyState?.studyEndMessage || ''
    if (message) {
      alert(message)
    }
  }
  const onShowWorksheet = (workSheetPath: string) => {
    if (!isStudyEnd) {
      openWindow(workSheetPath, {
        external: true,
        target: '_blank',
        feature: 'noopener, noreferrer',
      })
    } else {
      onStudyEndMessage()
    }
  }

  const onConfirmVocabularyOption = (option: VocabularyOption) => {
    if (!selectBookInfoData?.vocabularyPath) {
      return
    }
    if (!isStudyEnd) {
      const url = new URL(selectBookInfoData.vocabularyPath)
      const params = new URLSearchParams(url.search)

      const paramsMap = new Map()
      params.forEach((value, key) => {
        paramsMap.set(key, value)
      })
      if (option.vocabulary) {
      }
      paramsMap.set('args4', option.vocabulary ? 'Y' : 'N')
      if (option.definition1) {
        paramsMap.set('args5', option.definition1Value)
      } else {
        paramsMap.set('args5', 'N')
      }
      paramsMap.set('args6', option.definition2 ? 'Y' : 'N')
      paramsMap.set('args7', option.exampleSentence ? 'Y' : 'N')
      paramsMap.set('args8', option.studentName ? 'Y' : 'N')
      const searchParams = new URLSearchParams()
      paramsMap.forEach((value, key) => {
        searchParams.append(key, value)
      })
      const queryString = searchParams.toString()

      const vocabularyUrl = `${url.protocol}//${url.host}${url.pathname}?${queryString}`
      openWindow(vocabularyUrl, {
        external: true,
        target: '_blank',
        feature: 'noopener, noreferrer',
      })
      setSelectBookInfoOption({
        ...selectBookInfoOption,
        isShowVocaPrintOptions: false,
      })
    } else {
      onStudyEndMessage()
    }
  }

  const onStartStudyClick = () => {
    if (isStudyEnd) {
      onStudyEndMessage()
      return
    }
    if (!focusBookInfoData) {
      return
    }
    if (focusBookInfoData.studyId) {
      studyStart.mutate({
        type: 'study',
        bookInfo: focusBookInfoData,
      })
    } else {
      if (bookWizardStudentHistoryCount > 0) {
        if (
          bookWizardStudentHistoryCount === 1 ||
          defaultBookWizardStudentHistoryId
        ) {
          studyStart.mutate({
            type: 'study',
            bookInfo: focusBookInfoData,
            studentHistoryId: defaultBookWizardStudentHistoryId!,
          })
        } else {
          setSelectBookInfo({
            levelRoundId: focusBookLevelRoundId!,
            surfaceImagePath: focusBookInfoData.surfaceImage,
            title: focusBookInfoData.title,
            bookCode: focusBookInfoData.bookCode,
          })
          setSelectBookInfoOption({
            ...selectBookInfoOption,
            isShowModal: true,
          })
        }
      } else {
        alert('도서 추가 실패')
      }
    }
  }

  const goStudy = (bookInfo: BookDetailInfo) => {
    if (isStudyEnd) {
      onStudyEndMessage()
      return
    }
    onStartStudy(bookInfo)
  }

  return (
    <>
      <DailyRGCourseListStyle ref={containerRef}>
        {sectionList &&
          sectionList.list &&
          sectionList.list.length > 0 &&
          sectionList.list.map((section, i) => {
            const bgColor = DailyRGTheme.getThemeColor(levelKey, i)
            return (
              <Fragment key={section.sectionId}>
                <DailyRGSection
                  ref={
                    currentSectionId === section.sectionId
                      ? focusCourseRef
                      : undefined
                  }
                  key={section.sectionId}
                  title={section.sectionName}
                  completedCount={section.completeBooks}
                  totalCount={section.totalBooks}
                  isActive={currentSectionId === section.sectionId}
                  bgColor={bgColor}
                  progressColor={DailyRGTheme.progressColor}
                  onSectionClick={() => {
                    router.push(
                      `${SITE_PATH.NW82.DAILY_RESULT}?stage=${stageId}&section=${section.sectionId}`,
                    )
                  }}
                />

                {currentSectionId === section.sectionId &&
                  bookList &&
                  bookList.book &&
                  bookList.book.length > 0 &&
                  bookList.book.map((book, i) => {
                    const isBookInfoLoaded =
                      !!selectBookInfoData &&
                      selectBookInfoData.levelRoundId === book.levelRoundId

                    const isPreK = book.levelName.startsWith('EB-PK')
                    const isTarget = focusBookLevelRoundId === book.levelRoundId
                    const imagePath = isPreK
                      ? book.studyImagePath
                      : book.surfaceImagePath

                    const expendMenu: {
                      text: string
                      subText?: string
                      onClick?: () => void
                    }[] = []
                    if (isBookInfoLoaded && selectBookInfoOption.isShowMore) {
                      expendMenu.push({
                        text: 'Book Info',
                        onClick: () => {
                          setSelectBookInfoOption({
                            ...selectBookInfoOption,
                            isShowModal: true,
                          })
                        },
                      })
                      if (selectBookInfoData?.vocabularyPath) {
                        expendMenu.push({
                          text: 'Print Vocabulary',
                          onClick: () => {
                            setSelectBookInfoOption({
                              ...selectBookInfoOption,
                              isShowVocaPrintOptions: true,
                            })
                          },
                        })
                      }
                      if (selectBookInfoData?.workSheetPath) {
                        expendMenu.push({
                          text: 'Print Worksheet',
                          onClick: () => {
                            onShowWorksheet(selectBookInfoData.workSheetPath)
                          },
                        })
                      }
                    }
                    return (
                      <DailyRGBookItem
                        key={`${book.no}-${book.levelRoundId}`}
                        ref={i === focusBookIndex ? focusTargetRef : undefined}
                        no={book.no}
                        imgUrl={imagePath}
                        title={book.topicTitle}
                        point={book.getableRgPoint}
                        isCurrent={isTarget}
                        passCount={book.rgPointCount}
                        isPreK={isPreK}
                        expendMenu={expendMenu}
                        color={bgColor}
                        onStart={() => {
                          onStartStudyClick()
                        }}
                        onImageLoaded={
                          i === focusBookIndex && !isItemHeightCatched
                            ? (isSuccess) => {
                                if (isSuccess) {
                                  setItemHeightCatched(true)
                                }
                              }
                            : undefined
                        }
                        onExpendMenuClick={(isOpen) => {
                          if (isStudyEnd) {
                            onStudyEndMessage()
                            return
                          }
                          if (isOpen) {
                            setSelectBookInfo({
                              levelRoundId: book.levelRoundId,
                              surfaceImagePath: book.surfaceImagePath,
                              title: book.topicTitle,
                              bookCode: book.levelName,
                            })
                            setSelectBookInfoOption({
                              ...selectBookInfoOption,
                              isShowMore: true,
                            })
                          } else {
                            setSelectBookInfoOption({
                              ...selectBookInfoOption,
                              isShowMore: false,
                            })
                          }
                        }}
                      />
                    )
                  })}
              </Fragment>
            )
          })}
      </DailyRGCourseListStyle>

      {selectBookInfo && selectBookInfoOption.isShowModal && (
        <BookInfoModal
          onClickClose={() => {
            setSelectBookInfoOption({
              ...selectBookInfoOption,
              isShowModal: false,
            })
          }}
          title={selectBookInfo.title}
          bookCode={selectBookInfo.bookCode}
          imgSrc={selectBookInfo.surfaceImagePath}
          levelRoundId={selectBookInfo.levelRoundId}
          studentHistoryId={
            selectBookInfo.studentHistoryId ||
            defaultBookWizardStudentHistoryId!
          }
        />
      )}
      {selectBookInfoOption.isShowVocaPrintOptions && (
        <PrintVocabularyModal
          onConfirm={onConfirmVocabularyOption}
          onClickClose={() => {
            setSelectBookInfoOption({
              ...selectBookInfoOption,
              isShowVocaPrintOptions: false,
            })
          }}
        />
      )}

      <Gap size={100} />

      {jumpButtonState && (
        <QuickJumpButtonStyle
          isVisible={true}
          onClick={() => {
            moveToFocusTarget('smooth')
          }}>
          {jumpButtonState === 'up' && (
            <Image
              src={Assets.Icon.arrowUpBlue}
              alt="arrow up right"
              width={30}
              height={30}
            />
          )}
          {jumpButtonState === 'down' && (
            <Image
              src={Assets.Icon.arrowDownBlue}
              alt="arrow down right"
              width={30}
              height={30}
            />
          )}
        </QuickJumpButtonStyle>
      )}
    </>
  )
}
