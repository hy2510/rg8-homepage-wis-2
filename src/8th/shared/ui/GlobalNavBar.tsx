'use client'

import { Assets } from '@/8th/assets/asset-library'
import CalendarModal from '@/8th/features/achieve/ui/modal/CalendarModal'
import LevelTestInfoModal from '@/8th/features/student/ui/modal/LevelTestInfoModal'
import { useIsTabletLarge } from '@/8th/shared/context/ScreenModeContext'
import DropdownMenu from '@/8th/shared/ui/Dropdowns'
import { openWindow } from '@/8th/shared/utils/open-window'
import SITE_PATH from '@/app/site-path'
import Image, { StaticImageData } from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  DisplayNoneStyle,
  GlobalNavBarStyle,
  MenuItemStyle,
} from '../styled/SharedStyled'
import { Gap } from './Misc'

/**
 * Daily RG ... More 까지
 */

const MP3_URL = {
  dodo: 'https://util.readinggate.com/Library/DodoABCWorkSheetMP3Info',
  pk: 'https://wcfresource.a1edu.com/NewSystem/AppMobile/webview/randing/prek_workbook_mp3/',
}

export default function GlobalNavBar() {
  const isGnbBottom = useIsTabletLarge('smaller')

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCalendarOpen, setCalendarOpen] = useState(false)
  const [isLevelTestOpen, setLevelTestOpen] = useState(false)

  const pathname = usePathname()

  const router = useRouter()

  const dropdownItems: { text: string; onClick: () => void }[] = [
    { text: 'Level Test', onClick: () => setLevelTestOpen(true) },
    { text: 'Try Again', onClick: () => router.push(SITE_PATH.NW82.TRYAGAIN) },
    {
      text: 'Setting',
      onClick: () => router.push(SITE_PATH.NW82.ACCOUNTINFO_SETTING),
    },
    {
      text: 'Workbook Units',
      onClick: () => router.push(`${SITE_PATH.NW82.EB_WORKBOOK}/ka`),
    },
    {
      text: 'PK Workbook MP3',
      onClick: () =>
        openWindow(MP3_URL.dodo, {
          external: true,
          target: '_blank',
          feature: 'noopener, noreferrer',
        }),
    },
    {
      text: 'PK Classic Workbook MP3',
      onClick: () =>
        openWindow(MP3_URL.pk, {
          external: true,
          target: '_blank',
          feature: 'noopener, noreferrer',
        }),
    },
  ]
  if (isGnbBottom) {
    // 더빙룸 메뉴 제거
    // dropdownItems.splice(3, 0, {
    //   text: 'Dubbing',
    //   onClick: () => router.push(SITE_PATH.NW82.EB_WORKBOOK),
    // })
  }

  return (
    <GlobalNavBarStyle zIndex={isDropdownOpen ? 1000 : 100}>
      <div className="logo-container">
        <Image src={Assets.Image.AppLogo} alt="App Logo" className="logo" />
      </div>

      <div className="menu-container">
        <MenuItem
          icon={Assets.Icon.Gnb.main}
          text="DAILY RG"
          isActive={pathname.includes(SITE_PATH.NW82.DAILY_RG)}
          linkUrl={SITE_PATH.NW82.DAILY_RG}
        />

        <MenuItem
          icon={Assets.Icon.Gnb.ebooks}
          text="E-BOOKS"
          isActive={pathname.includes(SITE_PATH.NW82.EB)}
          linkUrl={SITE_PATH.NW82.EB}
        />

        <MenuItem
          icon={Assets.Icon.Gnb.bookQuiz}
          text="BOOK QUIZ"
          isActive={pathname.includes(SITE_PATH.NW82.PB)}
          linkUrl={SITE_PATH.NW82.PB}
        />

        <MenuItem
          icon={Assets.Icon.Gnb.myActivity}
          text="MY ACTIVITY"
          isActive={pathname.includes(SITE_PATH.NW82.ACTIVITY)}
          linkUrl={SITE_PATH.NW82.ACTIVITY}
        />

        <DisplayNoneStyle hideOnLabtopS>
          {/* // 더빙룸 메뉴 제거
          <div className="divider" />
          <Gap size={10} />
          <MenuItem icon={Assets.Icon.Gnb.dubbing} text="DUBBING" /> 
          */}
          <Gap size={10} />
          <div className="divider" />
          <Gap size={10} />
          <MenuItem
            icon={Assets.Icon.Gnb.calendar}
            text="CALENDAR"
            onClick={() => setCalendarOpen(true)}
          />
        </DisplayNoneStyle>

        <MenuItem
          icon={Assets.Icon.Gnb.more}
          text="MORE"
          isActive={false}
          isDropdown={true}
          onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          isOpen={isDropdownOpen}
          dropdownItems={dropdownItems}
        />
      </div>
      {isCalendarOpen && (
        <CalendarModal onCloseModal={() => setCalendarOpen(false)} />
      )}
      {isLevelTestOpen && (
        <LevelTestInfoModal onCloseModal={() => setLevelTestOpen(false)} />
      )}
    </GlobalNavBarStyle>
  )
}

interface MenuItemProps {
  icon?: StaticImageData
  text?: string
  isActive?: boolean
  isDropdown?: boolean
  onDropdownToggle?: () => void
  isOpen?: boolean
  dropdownItems?: { text: string; onClick: () => void }[]
  linkUrl?: string
  onClick?: () => void
}

const MenuItem = ({
  icon,
  text,
  isActive,
  isDropdown,
  onDropdownToggle,
  isOpen,
  dropdownItems,
  linkUrl,
  onClick,
}: MenuItemProps) => {
  const isGnbBottom = useIsTabletLarge('smaller')

  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (linkUrl) {
      router.push(linkUrl)
    } else if (isDropdown && onDropdownToggle) {
      onDropdownToggle()
    }
  }

  return (
    <MenuItemStyle
      className={isActive ? 'is-active' : ''}
      onClick={handleClick}>
      <div className="menu-item-icon">
        <Image
          src={icon as StaticImageData}
          alt={text || ''}
          width={34}
          height={34}
        />
      </div>

      <div className="menu-item-text">{text}</div>

      {isDropdown && isOpen && dropdownItems && (
        <DropdownMenu
          items={dropdownItems}
          isOpen={isOpen}
          onClose={() => {
            if (onDropdownToggle) {
              onDropdownToggle()
            }
          }}
          position={isGnbBottom ? 'topRight' : 'rightCenter'}
        />
      )}
    </MenuItemStyle>
  )
}
