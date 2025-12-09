import { Assets } from '@/8th/assets/asset-library'
import { useReadingKingTrophy } from '@/8th/features/achieve/service/achieve-query'
import {
  ModalBodyStyle,
  ModalHeaderStyle,
} from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, StreakLine, TextStyle } from '@/8th/shared/ui/Misc'
import { ModalContainer } from '@/8th/shared/ui/Modal'
import Image from 'next/image'
import { Fragment } from 'react'

/**
 * 영어독서왕 수상 모달
 */

interface ChallengeTrophyProps {
  onClickClose: () => void
}

export default function ChallengeTrophyModal({
  onClickClose,
}: ChallengeTrophyProps) {
  const trophy = useReadingKingTrophy()

  if (trophy.isLoading) {
    return <div></div>
  }

  return (
    <ModalContainer>
      <ModalHeaderStyle>
        <div className="title">영어 독서왕 수상 이력</div>
        <div className="btn-close" onClick={onClickClose} />
      </ModalHeaderStyle>
      <ModalBodyStyle viewCloud>
        {trophy.data?.list.map((item, i) => {
          return (
            <Fragment key={`award-item-${item.prizeTitle}-${item.prizeGrade}`}>
              {i > 0 && <StreakLine />}
              <AwardItem
                key={item.registDate}
                awardName={item.prizeTitle}
                awardDate={item.registDate}
                grade={item.prizeGrade}
              />
            </Fragment>
          )
        })}
      </ModalBodyStyle>
    </ModalContainer>
  )
}

function AwardItem({
  awardName,
  awardDate,
  grade,
}: {
  awardName: string
  awardDate: string
  grade: number
}) {
  let trophyImage = Assets.Challenge.best
  if (grade === 1) {
    trophyImage = Assets.Challenge.best
  } else if (grade === 2) {
    trophyImage = Assets.Challenge.excellence
  } else if (grade === 3) {
    trophyImage = Assets.Challenge.grand
  } else if (grade === 4) {
    trophyImage = Assets.Challenge.sincerity
  }

  return (
    <BoxStyle
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={10}>
      <Image src={trophyImage} alt="Award Challenge" width={120} height={120} />
      <BoxStyle
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}>
        <TextStyle
          fontSize="medium"
          fontColor="primary"
          fontFamily="sans"
          fontWeight={800}>
          {awardName} 수상
        </TextStyle>
        <TextStyle
          fontSize="medium"
          fontColor="secondary"
          fontFamily="sans"
          fontWeight={800}>
          {awardDate}
        </TextStyle>
      </BoxStyle>
    </BoxStyle>
  )
}
