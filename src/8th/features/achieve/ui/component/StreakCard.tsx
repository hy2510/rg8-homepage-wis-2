import { Assets } from '@/8th/assets/asset-library'
import {
  StreakCardStyle,
  StreakStatusStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import {
  AwardBgStyle,
  AwardImageStyle,
  CommonTitleStyle,
  WidgetBoxStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import useTranslation from '@/localization/client/useTranslations'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import StreakModal from '../modal/StreakModal'

const MAX_STREAK_DAY = 300
const STREAK_DAY_STEP = 20

type StreakStatus = 'zero' | 'progress' | 'award'

/**
 * 연속학습 카드 클래식 버전 컴포넌트
 */
export function StreakCardClassic({
  isTodayStudy,
  streakCount,
}: {
  isTodayStudy: boolean
  streakCount: number
}) {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <WidgetBoxStyle height="168px">
      <StreakCardStyle>
        <CommonTitleStyle noLink>{t('t8th253')}</CommonTitleStyle>
        <BoxStyle
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
          padding="10px">
          <Image
            src={Assets.Icon.Side.streakFire}
            alt=""
            width={50}
            height={50}
          />
          <TextStyle fontSize="xlarge">{`${t('t8th258', { num: streakCount })}`}</TextStyle>
        </BoxStyle>
      </StreakCardStyle>
    </WidgetBoxStyle>
  )
}

/**
 * 연속학습 카드 컴포넌트
 */
export default function StreakCard({
  isTodayStudy,
  streakCount,
}: {
  isTodayStudy: boolean
  streakCount: number
}) {
  //@language 'common'
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const awardCount =
    Math.floor(streakCount / STREAK_DAY_STEP) * STREAK_DAY_STEP +
    STREAK_DAY_STEP
  let streakStatus: StreakStatus = 'zero'

  if (isTodayStudy && streakCount > 0 && streakCount % STREAK_DAY_STEP === 0) {
    streakStatus = 'award'
  } else if (streakCount > 0) {
    streakStatus = 'progress'
  } else {
    streakStatus = 'zero'
  }

  return (
    <>
      <WidgetBoxStyle getAward={streakStatus === 'award'} height="168px">
        <StreakCardStyle>
          <CommonTitleStyle
            onClick={() => setIsModalOpen(true)}
            getAward={awardCount === streakCount}>
            {t('t8th253')}
          </CommonTitleStyle>
          {streakStatus === 'zero' && <StreakStatusReady />}
          {streakStatus === 'progress' && (
            <StreakStatusProgress
              streakCount={streakCount}
              awardCount={awardCount}
              isTodayStudy={isTodayStudy}
            />
          )}
          {streakStatus === 'award' && (
            <StreakStatusAward awardCount={streakCount} />
          )}
        </StreakCardStyle>
        {streakStatus === 'award' && (
          <>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={`petal${i + 3}`} className={`petal${i + 3}`} />
            ))}
          </>
        )}
      </WidgetBoxStyle>
      {isModalOpen && <StreakModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

function StreakStatusAward({ awardCount }: { awardCount: number }) {
  // @language 'common'
  const { t } = useTranslation()

  const awardImage = useMemo(() => {
    if (awardCount > 300) {
      return Assets.Icon.Streak.streakMax1
    } else {
      return Assets.Icon.Streak[
        `streak${awardCount}Days` as keyof typeof Assets.Icon.Streak
      ]
    }
  }, [awardCount])

  return (
    <StreakStatusStyle>
      <BoxStyle
        width="100%"
        display="grid"
        gridTemplateColumns="1fr 100px"
        alignItems="center"
        gap={5}>
        <TextStyle
          fontFamily="sans"
          fontColor="#fff"
          fontWeight="bold"
          fontSize="large"
          padding="0 0 0 5px">
          {t('t8th256', { num: awardCount })}
        </TextStyle>
        <BoxStyle position="relative" width="100px" height="100px">
          <AwardImageStyle>
            <Image src={awardImage} alt="Streak Award" width={80} height={80} />
          </AwardImageStyle>
          <AwardBgStyle />
        </BoxStyle>
      </BoxStyle>
    </StreakStatusStyle>
  )
}

function StreakStatusReady() {
  // @language 'common'
  const { t } = useTranslation()

  return (
    <StreakStatusStyle>
      <div className="streak-status-ready">
        <Image
          src={Assets.Icon.Side.streakReady}
          alt=""
          width={50}
          height={50}
          className="streak-status-ready-icon"
        />
        <div className="streak-progress-text">{t('t8th257')}</div>
      </div>
    </StreakStatusStyle>
  )
}

function StreakStatusProgress({
  streakCount,
  awardCount,
  isTodayStudy,
}: {
  streakCount: number
  awardCount: number
  isTodayStudy: boolean
}) {
  // @language 'common'
  const { t } = useTranslation()

  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    setProgressValue(0)
    const id = setTimeout(() => {
      const progressWidth = Math.max(
        0,
        Math.min(100, ((streakCount - awardCount + 20) / 20) * 100),
      )

      setProgressValue(progressWidth)
    }, 1000)
    return () => clearTimeout(id)
  }, [streakCount, awardCount])

  let commentText = ''
  if (isTodayStudy) {
    commentText = t('t8th284')
  } else if (awardCount % STREAK_DAY_STEP !== 0) {
    commentText = t('t8th285')
  } else {
    commentText = t('t8th257')
  }

  return (
    <StreakStatusStyle>
      <BoxStyle
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={10}
        width="100%">
        <TextStyle
          fontSize="small"
          fontColor="secondary"
          fontFamily="sans"
          margin="0 0 20px 0"
          width="100%">
          {commentText}
        </TextStyle>
        <div className={`streak-progress ${isTodayStudy ? 'active' : ''}`}>
          <div
            className={`streak-progress-fill ${isTodayStudy ? 'active' : ''}`}
            style={{ width: `${progressValue}%` }}>
            <Image
              src={Assets.Icon.Side.streakFire}
              alt=""
              width={50}
              height={50}
              className="streak-fire-icon"
              style={{ transition: `width 1.5s ease-in-out` }}
            />
          </div>
        </div>
        <div className={`streak-progress-text ${isTodayStudy ? 'active' : ''}`}>
          {streakCount}
          <span>
            /{awardCount} {t('t8th255')}
          </span>
        </div>
      </BoxStyle>
    </StreakStatusStyle>
  )
}
