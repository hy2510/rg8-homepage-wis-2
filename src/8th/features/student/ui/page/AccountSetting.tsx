'use client'

import {
  useChangeListenAndRepeat,
  useChangeStudentAvatar,
  useChangeStudySettingReadingUnit,
  useChangeStudySettingStartScreen,
  useChangeStudySettings,
  useStudentAvatarList,
  useStudentEarnReadingUnit,
} from '@/8th/features/student/service/setting-query'
import { useStudent } from '@/8th/features/student/service/student-query'
import SettingCheckSelector from '@/8th/features/student/ui/component/SettingCheckSelector'
import SettingHeader from '@/8th/features/student/ui/component/SettingHeader'
import SettingImageSelector from '@/8th/features/student/ui/component/SettingImageSelector'
import SettingRadioSelector from '@/8th/features/student/ui/component/SettingRadioSelector'
import { BoxStyle } from '@/8th/shared/ui/Misc'
import { SubPageNavHeader } from '@/8th/shared/ui/SubPageNavHeader'
import SITE_PATH from '@/app/site-path'
import useTranslation from '@/localization/client/useTranslations'
import { useEffect, useState } from 'react'

export default function AccountSetting() {
  // @language 'common'
  const { t } = useTranslation()

  const { data, isLoading } = useStudent()
  const { data: avatarData, isLoading: isAvatarDataLoading } =
    useStudentAvatarList()
  const { data: readingUnitData, isLoading: isReadingUnitDataLoading } =
    useStudentEarnReadingUnit()

  if (
    isLoading ||
    isAvatarDataLoading ||
    isReadingUnitDataLoading ||
    !data ||
    !avatarData ||
    !readingUnitData
  ) {
    return <div></div>
  }

  const screenTypes = ['DailyRG', 'eBook', 'pBook', 'Todo']
  let startScreen: 'DailyRG' | 'eBook' | 'pBook' | 'Todo' = 'DailyRG'
  if (screenTypes.includes(data.student.startScreen)) {
    startScreen = data.student.startScreen as
      | 'DailyRG'
      | 'eBook'
      | 'pBook'
      | 'Todo'
  }

  const avatarList = avatarData.list.map((avatar) => ({
    label: avatar.name,
    value: avatar.avatarId,
    image: avatar.imageLarge,
  }))
  const myAvatar = avatarData.avatarId || '097971'

  const readingUnitList = readingUnitData.list.map((unit) => ({
    label: unit.name,
    value: unit.readingUnitId,
    image: unit.image,
  }))
  const myReadingUnit = data.student.studyReadingUnitId

  return (
    <>
      <SubPageNavHeader
        title={t('t8th082')}
        parentPath={SITE_PATH.NW82.ACTIVITY}
      />
      <BoxStyle>
        <MainScreenSetting startScreen={startScreen} />
        <AvatarSetting avatar={myAvatar} avatarList={avatarList} />
        <QuizFriendSetting
          readingUnit={myReadingUnit}
          readingUnitList={readingUnitList}
        />
        <ListenAndRepeatSetting
          levelK={data.student.eBKListenRepeat || false}
          level1={data.student.eB1ListenRepeat || false}
        />
        <QuizHelperSetting
          hint={data.student.viewStep2Skip || false}
          chance={data.student.viewStep3Hint || false}
        />
      </BoxStyle>
    </>
  )
}

function useSavedMarker() {
  const [isSaved, setSaved] = useState(false)

  useEffect(() => {
    const timer = isSaved
      ? setTimeout(() => {
          setSaved(false)
        }, 3000)
      : undefined
    return () => {
      clearTimeout(timer)
    }
  }, [isSaved])

  const activeSaved = () => {
    setSaved(true)
  }
  const clearSaved = () => {
    setSaved(false)
  }
  return { isSaved, activeSaved, clearSaved }
}

function MainScreenSetting({
  startScreen,
}: {
  startScreen: 'DailyRG' | 'eBook' | 'pBook' | 'Todo'
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const options = [
    { value: 'DailyRG', label: 'DAILY RG' },
    { value: 'eBook', label: 'E-BOOKS' },
    { value: 'pBook', label: 'BOOK QUIZ' },
    { value: 'Todo', label: 'To-Do' },
  ]

  const { mutate: changeStartScreen } = useChangeStudySettingStartScreen({
    onSuccess: () => {
      activeSaved()
      setValue(chooseValue)
    },
  })

  const [value, setValue] = useState(startScreen)
  const [chooseValue, setChooseValue] = useState(value)
  const { isSaved, activeSaved, clearSaved } = useSavedMarker()

  const onSaveClick = () => {
    changeStartScreen({ startScreen: chooseValue })
  }

  const onCancelClick = () => {
    setChooseValue(value)
  }

  const onChangeItem = (newValue: string) => {
    if (isSaved) {
      clearSaved()
    }
    setChooseValue(newValue as 'DailyRG' | 'eBook' | 'pBook' | 'Todo')
  }

  return (
    <>
      <SettingHeader
        title={t('t8th083')}
        isChanged={chooseValue !== value}
        isSaved={isSaved}
        onSave={onSaveClick}
        onCancel={onCancelClick}
      />
      <SettingRadioSelector
        value={chooseValue}
        list={options}
        onChange={onChangeItem}
      />
    </>
  )
}

function AvatarSetting({
  avatar,
  avatarList,
}: {
  avatar: string
  avatarList: { label: string; value: string; image: string }[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const { mutate: changeAvatar } = useChangeStudentAvatar({
    onSuccess: () => {
      activeSaved()
      setValue(chooseValue)
    },
  })

  const [value, setValue] = useState(avatar)
  const [chooseValue, setChooseValue] = useState(value)
  const { isSaved, activeSaved, clearSaved } = useSavedMarker()

  const onSaveClick = () => {
    changeAvatar(chooseValue)
  }

  const onCancelClick = () => {
    setChooseValue(avatar)
  }

  const onChangeItem = (newValue: string) => {
    if (isSaved) {
      clearSaved()
    }
    setChooseValue(newValue)
  }

  const isChanged = value !== chooseValue
  return (
    <>
      <SettingHeader
        title={t('t8th084')}
        isChanged={isChanged}
        isSaved={isSaved}
        onSave={onSaveClick}
        onCancel={onCancelClick}
      />
      <SettingImageSelector
        value={chooseValue}
        list={avatarList}
        onChange={onChangeItem}
      />
    </>
  )
}

function QuizFriendSetting({
  readingUnit,
  readingUnitList,
}: {
  readingUnit: string
  readingUnitList: { label: string; value: string; image: string }[]
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const { mutate: changeStudySettingReadingUnit } =
    useChangeStudySettingReadingUnit({
      onSuccess: () => {
        activeSaved()
        setValue(chooseValue)
      },
    })
  const [value, setValue] = useState(readingUnit)
  const [chooseValue, setChooseValue] = useState(value)
  const { isSaved, activeSaved, clearSaved } = useSavedMarker()

  const onSaveClick = () => {
    changeStudySettingReadingUnit(chooseValue)
  }

  const onCancelClick = () => {
    setChooseValue(value)
  }

  const onChangeItem = (newValue: string) => {
    if (isSaved) {
      clearSaved()
    }
    setChooseValue(newValue)
  }
  return (
    <>
      <SettingHeader
        title={t('t8th085')}
        isChanged={chooseValue !== value}
        isSaved={isSaved}
        onSave={onSaveClick}
        onCancel={onCancelClick}
      />
      <SettingImageSelector
        value={chooseValue}
        list={readingUnitList}
        onChange={onChangeItem}
      />
    </>
  )
}

function ListenAndRepeatSetting({
  levelK,
  level1,
}: {
  levelK: boolean
  level1: boolean
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const ListenAndRepeatSelectOption = [
    { value: 'levelK', label: t('t8th087', { txt: 'K' }) },
    { value: 'level1', label: t('t8th087', { txt: '1' }) },
  ]
  const { mutate: changeListenAndRepeat } = useChangeListenAndRepeat({
    onSuccess: () => {
      activeSaved()
      setValue([...chooseValue])
    },
  })

  const [value, setValue] = useState<string[]>(
    [levelK ? 'levelK' : '', level1 ? 'level1' : '']
      .filter((item) => !!item)
      .sort(),
  )
  const [chooseValue, setChooseValue] = useState<string[]>([...value])
  const { isSaved, activeSaved, clearSaved } = useSavedMarker()

  const onSaveClick = () => {
    const levelK =
      value.includes('levelK') === chooseValue.includes('levelK')
        ? 'none'
        : chooseValue.includes('levelK')
    const level1 =
      value.includes('level1') === chooseValue.includes('level1')
        ? 'none'
        : chooseValue.includes('level1')
    changeListenAndRepeat({
      levelK,
      level1,
    })
  }

  const onCancelClick = () => {
    setChooseValue(value)
  }

  const onChangeItem = (newValue: string[]) => {
    if (isSaved) {
      clearSaved()
    }
    setChooseValue([...newValue])
  }

  const isChanged = !(
    chooseValue.length === value.length &&
    chooseValue.every((item, index) => item === value[index])
  )
  return (
    <>
      <SettingHeader
        title={t('t8th086')}
        isChanged={isChanged}
        isSaved={isSaved}
        onSave={onSaveClick}
        onCancel={onCancelClick}
      />
      <SettingCheckSelector
        values={chooseValue}
        list={ListenAndRepeatSelectOption}
        onChange={onChangeItem}
      />
    </>
  )
}

function QuizHelperSetting({
  hint,
  chance,
}: {
  hint: boolean
  chance: boolean
}) {
  // @Language 'common'
  const { t } = useTranslation()

  const StudyQuizHelperOptions = [
    {
      value: 'hint',
      label: t('t8th089'),
    },
    { value: 'chance', label: t('t8th090') },
  ]

  const { mutate: changeStudySettings } = useChangeStudySettings({
    onSuccess: () => {
      activeSaved()
      setValue([...chooseValue])
    },
  })
  const [value, setValue] = useState<string[]>(
    [hint ? 'hint' : '', chance ? 'chance' : '']
      .filter((item) => !!item)
      .sort(),
  )
  const [chooseValue, setChooseValue] = useState<string[]>([...value])
  const { isSaved, activeSaved, clearSaved } = useSavedMarker()

  const onSaveClick = () => {
    const hint =
      value.includes('hint') === chooseValue.includes('hint')
        ? 'none'
        : chooseValue.includes('hint')
    const chance =
      value.includes('chance') === chooseValue.includes('chance')
        ? 'none'
        : chooseValue.includes('chance')
    changeStudySettings({ hint, chance })
  }

  const onCancelClick = () => {
    setChooseValue(value)
  }

  const onChangeItem = (newValue: string[]) => {
    if (isSaved) {
      clearSaved()
    }
    setChooseValue([...newValue])
  }

  const isChanged = !(
    chooseValue.length === value.length &&
    chooseValue.every((item, index) => item === value[index])
  )
  return (
    <>
      <SettingHeader
        title={t('t8th088')}
        isChanged={isChanged}
        isSaved={isSaved}
        onSave={onSaveClick}
        onCancel={onCancelClick}
      />
      <SettingCheckSelector
        values={chooseValue}
        list={StudyQuizHelperOptions}
        onChange={onChangeItem}
      />
    </>
  )
}
