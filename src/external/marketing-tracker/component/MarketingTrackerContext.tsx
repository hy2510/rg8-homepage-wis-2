'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import KakaoPixel from '../kakao-pixel/kakao-pixel'
import MetaPixel from '../meta-pixcel/meta-pixel'

const MarketingTrackerContext = React.createContext<
  | {
      pageView: (tag?: string) => void
      eventAction: (eventName: string, args?: any) => void
    }
  | undefined
>(undefined)

export default function MarketingTrackerContextProvider({
  children,
}: {
  children?: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParam = useSearchParams().toString()

  const [sdkLoading, setSdkLoading] = useState(false)

  useEffect(() => {
    const isKakaoLoad = KakaoPixel.init()
    const isMetaLoad = MetaPixel.init()
    setSdkLoading(isKakaoLoad || isMetaLoad)
  }, [])

  const action = useMemo(() => {
    return {
      pageView: (tag?: string) => {
        MetaPixel.pageView(tag)
        KakaoPixel.pageView(tag)
      },
      eventAction: (eventName: string, args?: any) => {
        MetaPixel.eventAction(eventName, args)
        KakaoPixel.eventAction(eventName, args)
      },
    }
  }, [])

  useEffect(() => {
    if (sdkLoading) {
      const path = `${pathname}${searchParam ? `?${searchParam}` : ''}`
      action.pageView()
    }
  }, [pathname, searchParam, sdkLoading, action])

  return (
    <MarketingTrackerContext.Provider value={action}>
      {children}
    </MarketingTrackerContext.Provider>
  )
}

export function useTrack() {
  const context = useContext(MarketingTrackerContext)
  if (!context) {
    throw Error('Tracker Context unbind.')
  }
  return context
}
