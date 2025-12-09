'use client'

import { Assets } from '@/8th/assets/asset-library'
import { StudentProfileCardStyle } from '@/8th/shared/styled/FeaturesStyled'
import { WidgetBoxStyle } from '@/8th/shared/styled/SharedStyled'
import { BoxStyle, TextStyle } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import NumberUtils from '@/util/number-utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

/**
 * 리딩유닛, 아바타, 이름 나오는 카드
 */

interface StudentProfileCardProps {
  studentName: string
  avatar: string
  level: string
  rank: number
  book: number
  point: number
  todo: number
  favorite: number
}

export default function StudentProfileCard({
  studentName,
  avatar,
  level,
  rank,
  book,
  point,
  todo,
  favorite,
}: StudentProfileCardProps) {
  // @Language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  return (
    <WidgetBoxStyle>
      <StudentProfileCardStyle>
        <div
          className="header"
          onClick={() => router.push(SITE_PATH.NW82.ACTIVITY)}>
          <div className="avatar">
            <Image src={avatar} alt="" width={50} height={50} />
          </div>
          <BoxStyle display="flex" flexDirection="column" gap={3}>
            <BoxStyle display="flex" alignItems="center" gap={5}>
              {/* <div className="rank">#{pointRank}</div> */}
              <div className="name">{studentName}</div>
            </BoxStyle>
            <TextStyle
              fontSize="0.75em"
              fontColor="lightBlue"
              padding="0 0 0 2px">
              Lv.{level} {0 < rank && rank < 1000 ? `/ Rank ${rank}` : ''}
            </TextStyle>
          </BoxStyle>
        </div>
        <div className="body">
          <div className="label">
            <Image
              src={Assets.Icon.Side.booksRead}
              alt=""
              width={34}
              height={34}
            />
            {t('t8th266')}
          </div>
          <div className="value">{book}</div>
          <div className="label">
            <Image
              src={Assets.Icon.Side.earnedPoints}
              alt=""
              width={34}
              height={34}
            />
            {t('t8th267')}
          </div>
          <div className="value">{NumberUtils.toRgDecimalPoint(point)}P</div>
          <div className="label">
            <Image src={Assets.Icon.Side.toDo} alt="" width={34} height={34} />
            {t('t8th268')}
          </div>
          <div
            className="value link"
            onClick={() => router.push(SITE_PATH.NW82.TODO)}>
            {todo}
          </div>
          <div className="label">
            <Image
              src={Assets.Icon.Side.favorite}
              alt=""
              width={34}
              height={34}
            />
            {t('t8th269')}
          </div>
          <div
            className="value link"
            onClick={() => router.push(SITE_PATH.NW82.FAVORITE)}>
            {favorite}
          </div>
        </div>
      </StudentProfileCardStyle>
    </WidgetBoxStyle>
  )
}
