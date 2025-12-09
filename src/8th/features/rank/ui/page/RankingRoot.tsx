'use client'

import RankCategory, {
  RankCategoryItem,
} from '@/8th/features/rank/ui/component/RankCategory'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useState } from 'react'
import RankingChallenge from './layout/RankingChallenge'
import RankingHallOfFame from './layout/RankingHallOfFame'
import RankingLevelMaster from './layout/RankingLevelMaster'
import RankingMonth from './layout/RankingMonth'

type TabType =
  | 'earned-points-rank'
  | 'reading-king'
  | 'level-master'
  | 'hall-of-fame'

export default function RankingRoot() {
  // @Language 'common'
  const { t } = useTranslation()

  const tabs: RankCategoryItem[] = [
    { label: t('t8th225'), value: 'earned-points-rank' },
    { label: t('t8th226'), value: 'reading-king' },
    { label: t('t8th227'), value: 'level-master' },
    { label: t('t8th228'), value: 'hall-of-fame' },
  ]

  const [selectedTab, setSelectedTab] = useState<TabType>('earned-points-rank')

  return (
    <>
      <SubPageNavHeader
        title={t('t8th270')}
        parentPath={SITE_PATH.NW82.RANKING}
      />
      <RankCategory
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={(tab: string) => setSelectedTab(tab as TabType)}
      />

      {selectedTab === 'earned-points-rank' && <RankingMonth />}
      {selectedTab === 'reading-king' && <RankingChallenge />}
      {selectedTab === 'level-master' && <RankingLevelMaster />}
      {selectedTab === 'hall-of-fame' && <RankingHallOfFame />}
    </>
  )
}
