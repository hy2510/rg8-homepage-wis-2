'use client'

import { useStudent } from '@/8th/features/student/service/student-query'
import { useDodoFriendsStory } from '@/8th/shared/res/dodo-story'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, StreakLine } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import { useLanguagePackContext } from '@/localization/client/LanguagePackContext'
import useTranslation from '@/localization/client/useTranslations'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReadingUnitStoryItem, {
  ReadingUnitStoryPrologue,
} from '../component/ReadingUnitStoryItem'

/**
 * 리딩유닛 모달
 */
interface ReadingUnitStoryModalProps {
  onClose: () => void
}

export default function ReadingUnitStoryModal({
  onClose,
}: ReadingUnitStoryModalProps) {
  // @language 'common'
  const { t } = useTranslation()
  const { language } = useLanguagePackContext()

  const { data, isFetching } = useStudent()
  const point = data?.student.rgPoint || 0 // 학생 토탈 포인트
  const dodofriends = useDodoFriendsStory(language)

  const currentProgressRef = useRef<HTMLDivElement>(null)

  // 전체 캐릭터 중에서 current 스토리 찾기
  const globalCurrentStory = useMemo(() => {
    for (const friend of dodofriends) {
      if (point < friend.minPoint) continue // 잠금된 캐릭터는 제외

      for (let i = 0; i < friend.list.length; i++) {
        const story = friend.list[i]
        const isCurrent =
          point < story.point && (i === 0 || point >= friend.list[i - 1].point)

        if (isCurrent) {
          return { friend, story, index: i }
        }
      }
    }
    return null
  }, [dodofriends, point])

  // current 스토리 위치로 자동 스크롤
  useEffect(() => {
    if (!isFetching && globalCurrentStory && currentProgressRef.current) {
      const timer = setTimeout(() => {
        const currentElement = currentProgressRef.current
        if (currentElement) {
          currentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isFetching, point, globalCurrentStory])

  const [openedReadingUnitId, setOpenedReadingUnitId] = useState<
    string | undefined
  >(undefined)

  const onClickReadingUnitStoryItem = (unitId: string) => {
    if (openedReadingUnitId === unitId) {
      setOpenedReadingUnitId(undefined)
    } else {
      setOpenedReadingUnitId(unitId)
    }
  }

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">{t('t8th200')}</div>
        <div className="btn-close" onClick={onClose} />
      </ModalHeaderStyle>

      <ModalBodyStyle viewCloud>
        <BoxStyle display="flex" flexDirection="column">
          <BoxStyle
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between">
            {isFetching ? (
              <div style={{ height: '100dvh' }} />
            ) : (
              dodofriends.map((friend, friendIndex) => {
                const isFriendUnlocked = point >= friend.minPoint

                return (
                  <div key={friend.id} style={{ width: '100%' }}>
                    {friendIndex > 0 && <StreakLine />}
                    {isFriendUnlocked && (
                      <>
                        <ReadingUnitStoryPrologue
                          readingUnitName={friend.name}
                          readingUnitPrologueText={friend.description}
                        />
                        <StreakLine />
                      </>
                    )}
                    {friend.list.map((story, storyIndex) => {
                      const unitId = `${friend.id}_${storyIndex}`

                      const isEarned = point >= story.point
                      const isCurrent =
                        globalCurrentStory &&
                        globalCurrentStory.friend.id === friend.id &&
                        globalCurrentStory.index === storyIndex

                      const minPoint =
                        storyIndex > 0
                          ? friend.list[storyIndex - 1].point
                          : friend.minPoint

                      let itemType:
                        | 'prologue'
                        | 'earned'
                        | 'current'
                        | 'notCompleted' = 'notCompleted'
                      if (isEarned) {
                        itemType = 'earned'
                      } else if (isCurrent) {
                        itemType = 'current'
                      }

                      return (
                        <div
                          key={unitId}
                          data-story-id={unitId}
                          ref={isCurrent ? currentProgressRef : null}>
                          <ReadingUnitStoryItem
                            type={itemType}
                            imgSrc={story.imagePath}
                            imgAniSrc={story.imagePath2}
                            earnedTitle={story.title}
                            earnedMessage={story.description}
                            currentPoint={point}
                            minPoint={minPoint}
                            maxPoint={story.point}
                            isOpen={openedReadingUnitId === unitId}
                            onClick={() => onClickReadingUnitStoryItem(unitId)}
                          />
                          {storyIndex < friend.list.length - 1 && (
                            <StreakLine />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </BoxStyle>
        </BoxStyle>
      </ModalBodyStyle>
    </ModalContainer>
  )
}
