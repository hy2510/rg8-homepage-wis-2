'use client'

import { Assets } from '@/8th/assets/asset-library'
import { useIsPhone } from '@/8th/shared/context/ScreenModeContext'
import {
  CollectionItemStyled,
  CollectionsStyled,
} from '@/8th/shared/styled/FeaturesStyled'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

export default function Collections({ bookType }: { bookType: 'eb' | 'pb' }) {
  // @Language 'common'
  const { t } = useTranslation()

  const isPhone = useIsPhone()

  return (
    <CollectionsStyled>
      <BoxStyle className="title" display="flex" gap={10}>
        <Image
          alt="collections"
          src={Assets.Icon.Study.collections}
          width={28}
          height={28}
        />
        <span>{t('t8th004')}</span>
      </BoxStyle>
      <BoxStyle
        display="grid"
        gridTemplateColumns={isPhone ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'}
        gap={isPhone ? 10 : 15}>
        {bookType === 'eb' && <EBCollectionList />}
        {bookType === 'pb' && <PBCollectionList />}
      </BoxStyle>
    </CollectionsStyled>
  )
}

function EBCollectionList() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <>
      <CollectionItem
        href={SITE_PATH.NW82.EB_NEWBOOK}
        iconSrc={Assets.Icon.Study.newBooks}
        iconWidth={31}
        iconHeight={14}
        iconBgColor="#F53259">
        {t('t8th005')}
      </CollectionItem>
      <CollectionItem
        href={`${SITE_PATH.NW82.EB_MOVIE}/ka`}
        iconSrc={Assets.Icon.Study.movie}
        iconWidth={22}
        iconHeight={22}
        iconBgColor="#FFA400">
        {t('t8th006')}
      </CollectionItem>
      <CollectionItem
        href={`${SITE_PATH.NW82.EB_WORKBOOK}/ka`}
        iconSrc={Assets.Icon.Study.workbook}
        iconWidth={22}
        iconHeight={22}
        iconBgColor="#A1CE05">
        {t('t8th007')}
      </CollectionItem>
      <CollectionItem
        href={SITE_PATH.NW82.EB_THEME}
        iconSrc={Assets.Icon.Study.theme}
        iconWidth={24}
        iconHeight={24}
        iconBgColor="#23C1EB">
        {t('t8th008')}
      </CollectionItem>
    </>
  )
}

function PBCollectionList() {
  // @Language 'common'
  const { t } = useTranslation()

  return (
    <>
      <CollectionItem
        href={SITE_PATH.NW82.PB_NEWBOOK}
        iconSrc={Assets.Icon.Study.newBooks}
        iconWidth={31}
        iconHeight={14}
        iconBgColor="#F53259">
        {t('t8th005')}
      </CollectionItem>
      <CollectionItem
        href={SITE_PATH.NW82.PB_THEME}
        iconSrc={Assets.Icon.Study.theme}
        iconWidth={24}
        iconHeight={24}
        iconBgColor="#23C1EB">
        {t('t8th008')}
      </CollectionItem>
    </>
  )
}

interface CollectionItemProps {
  children: React.ReactNode
  iconSrc?: string | StaticImageData
  iconWidth?: number
  iconHeight?: number
  iconBgColor?: string
  href: string
}

export function CollectionItem({
  children,
  iconSrc = Assets.Icon.Study.collections,
  iconWidth = 24,
  iconHeight = 24,
  iconBgColor = '#f0f0f0',
  href,
}: CollectionItemProps) {
  return (
    <CollectionItemStyled iconBgColor={iconBgColor}>
      <Link href={href}>
        <BoxStyle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%">
          <BoxStyle display="flex" alignItems="center" gap={15}>
            <div className="icon-box">
              <Image
                src={iconSrc}
                alt="collection-icon"
                width={iconWidth}
                height={iconHeight}
              />
            </div>
            {children}
          </BoxStyle>
          <Image
            src={Assets.Icon.chevronRightGray}
            alt="chevron-right"
            width={22}
            height={22}
          />
        </BoxStyle>
      </Link>
    </CollectionItemStyled>
  )
}
