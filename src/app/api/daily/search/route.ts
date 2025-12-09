import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import DailyRG from '@/repository/server/daily-rg'
import { RouteResponse, getBodyParameters } from '../../_util'
import { searchBook } from '../../library/search-book'

export async function GET(request: NextRequest) {
  const authorizationWithCookie = await getAuthorizationWithCookie()
  const token = authorizationWithCookie.getActiveAccessToken()

  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(request, 'stageId', 'sectionId')
  const stageId = parameter.getString('stageId', '')
  const sectionId = parameter.getString('sectionId', '')

  // return RouteResponse.response(HARDCODING_LP, { status: 200 })
  // return RouteResponse.response(HARDCODING_L2, { status: 200 })

  return searchBook({
    searchRequest: DailyRG.search(token, { stageId, sectionId }),
  })
}
