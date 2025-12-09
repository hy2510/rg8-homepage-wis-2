import { Assets } from '@/8th/assets/asset-library'
import { useIsTabletLarge } from '@/8th/shared/context/ScreenModeContext'
import {
  DailyRGCourseContainerStyle,
  DailyRGCourseStyle,
  ProgressBarContainerStyle,
  ProgressBarFillStyle,
  ProgressBarStyle,
} from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import Image from 'next/image'

/**
 * 제목, 진행상황, 개수
 */

interface DailyRGSectionProps {
  ref?: React.RefObject<HTMLDivElement | null>
  title: string
  completedCount: number
  totalCount: number
  isActive?: boolean
  bgColor?: string
  progressColor?: string
  onSectionClick?: () => void
}

export default function DailyRGSection({
  ref,
  title,
  completedCount,
  totalCount,
  isActive,
  bgColor: _bgColor,
  progressColor: _progressColor,
  onSectionClick,
}: DailyRGSectionProps) {
  const progressPercent = (completedCount / totalCount) * 100
  const isCompleted = totalCount > 0 && completedCount === totalCount

  const isGnbBottomTablet = useIsTabletLarge('smaller')

  const bgColor = isActive && _bgColor ? _bgColor : '#E9EDF3'
  const progressColor =
    isActive && _progressColor ? _progressColor : 'var(--color-gray-strong)'

  return (
    <DailyRGCourseContainerStyle ref={ref}>
      <DailyRGCourseStyle
        bgColor={isCompleted ? '#3C4B62' : bgColor}
        isCurrent={isActive}>
        <ProgressBarContainerStyle>
          <TextStyle
            fontColor={isActive || isCompleted ? '#fff' : 'secondary'}
            fontSize={isGnbBottomTablet ? '0.96em' : '1em'}
            className="course-title">
            {title}
          </TextStyle>
          {!isCompleted && (
            <ProgressBarStyle>
              <ProgressBarFillStyle
                progressColor={progressColor}
                style={{
                  width: `${progressPercent}%`,
                }}></ProgressBarFillStyle>
            </ProgressBarStyle>
          )}
          {isCompleted && (
            <Image
              src={Assets.Image.DailyRGCourseCompleted}
              alt="daily-rg-course-completed"
              width={80}
              height={80}
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '5px',
                zIndex: 1,
                opacity: 0.7,
              }}
            />
          )}
        </ProgressBarContainerStyle>
        <BoxStyle
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={5}
          position="relative"
          borderLeft="1.5px solid #fff"
          zIndex={1}
          onClick={onSectionClick}>
          {isActive ? (
            <Image src={Assets.Icon.menuWhite} alt="menu" />
          ) : (
            <Image src={Assets.Icon.menuGray} alt="menu" />
          )}
          <TextStyle
            fontColor={isActive ? '#fff' : 'secondary'}
            fontSize="0.7em">
            {completedCount}/{totalCount}
          </TextStyle>
        </BoxStyle>
      </DailyRGCourseStyle>
    </DailyRGCourseContainerStyle>
  )
}
