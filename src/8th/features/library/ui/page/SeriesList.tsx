'use client'

import { useCategorySeries } from '@/8th/features/library/service/library-query'
import ThemeItem from '@/8th/features/library/ui/component/ThemeItem'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useRouter } from 'next/navigation'

export default function SeriesList({ booktype }: { booktype: string }) {
  //@language 'common'
  const { t } = useTranslation()

  const router = useRouter()

  const categorySeries = useCategorySeries({
    bookType: booktype as 'EB' | 'PB',
  })

  return (
    <>
      <SubPageNavHeader
        title={`${t('t8th039')}`}
        parentPath={booktype === 'EB' ? SITE_PATH.NW82.EB : SITE_PATH.NW82.PB}
      />
      <BoxStyle display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={20}>
        {categorySeries?.isLoading ? (
          <div>Loading series...</div>
        ) : (
          categorySeries?.data?.category.map((series) => (
            <ThemeItem
              key={series.name}
              themeImgSrc={series.imagePath}
              title={series.name}
              onClick={() => {
                router.push(
                  `${booktype === 'EB' ? SITE_PATH.NW82.EB_SERIES : SITE_PATH.NW82.PB_SERIES}/find?name=${series.name}`,
                )
              }}
            />
          ))
        )}
      </BoxStyle>
    </>
  )
}
