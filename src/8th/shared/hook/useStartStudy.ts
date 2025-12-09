'use client'

import { useStaffInfoFlagLogin } from '@/7th/_client/store/student/info/selector'
import { BookDetailInfo } from '@/8th/features/library/model/book-info'
import { useStudentEarnReadingUnit } from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import { useDevicePlatformInfo } from '@/8th/shared/context/DeviceContext'
import { goToLevelTest, goToStudy } from '@/8th/shared/utils/study-start-8th'
import { useLanguagePackContext } from '@/localization/client/LanguagePackContext'

export default function useStartStudy(mode: 'review' | 'quiz') {
  const { language } = useLanguagePackContext()
  const device = useDevicePlatformInfo()
  const staffLoginStatus = useStaffInfoFlagLogin()

  const { data: student } = useStudent()
  const { data: readingUnitData } = useStudentEarnReadingUnit()

  const onStartStudy = (bookInfo: BookDetailInfo, isSpeak?: boolean) => {
    const readingUnitId =
      readingUnitData?.list?.find(
        (item) =>
          student?.student?.studyReadingUnitId &&
          item.readingUnitId === student?.student?.studyReadingUnitId,
      )?.id || ''
    goToStudy({
      studyInfo: bookInfo!,
      mode,
      user: staffLoginStatus === 'on' ? 'staff' : 'student',
      isStartSpeak: isSpeak,
      unit: readingUnitId,
      language,
      device,
    })
  }

  return {
    onStartStudy,
  }
}

export function useStartLevelTest() {
  const { language } = useLanguagePackContext()
  return () => goToLevelTest({ language })
}
