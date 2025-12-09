import './rg-8th.css'
import {
  BodyPreloadScript,
  HeadPreloadScript,
} from '@/8th/shared/component/PreloadScript'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import LanguagePackContextProvider from '@/localization/client/LanguagePackContext'
import { getLanguageResources } from '@/localization/server/i18next-server'
import { Viewport } from 'next'
import RootLayout from './_index/RootLayout'

export const metadata = {
  'apple-mobile-web-app-capable': 'yes',
  'apple-mobile-web-app-status-bar-style': 'white-translucent',
}
export const viewport: Viewport = {
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export default async function StartLayout(props: {
  params: Promise<{
    locale: string
  }>
  children?: React.ReactNode
}) {
  const params = await props.params

  const { children } = props

  const locale = params.locale
  const resCommon = await getLanguageResources(locale)

  /////
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  const userDetails = token
    ? authorizationWithCookie.getTokenUserDetails()
    : undefined
  const isStaffAccess =
    userDetails?.role === 'staff' || userDetails?.role === 'admin'
  const isLogin = !!userDetails?.uid

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <HeadPreloadScript />
      </head>
      <body>
        <LanguagePackContextProvider
          language={locale}
          namespace="common"
          res={JSON.stringify(resCommon)}>
          <RootLayout isStudentLogin={isLogin} isStaffLogin={isStaffAccess}>
            {children}
          </RootLayout>
          <div id="modal-portal" />
        </LanguagePackContextProvider>
        <BodyPreloadScript />
      </body>
    </html>
  )
}
