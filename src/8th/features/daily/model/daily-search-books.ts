import { execute, makeRequest } from '@/8th/shared/http'
import NumberUtils from '@/util/number-utils'
import RenewType from '@/util/string-utils'

/*
  No: number
  LevelName: string
  LevelRoundId: string
  TopicTitle: string
  SurfaceImagePath: string
  StudyImagePath: string
  BookPoint: number
  RgPointCount: number
  RgPointSum: number
  AddYn: boolean
  TodayStudyYn: boolean
  AddStudyCount: number
  TotalCount: number
  PreferenceAverage: number
  SeriesName: string
  AnimationPath: string
  RecommendedAge: string
  WorkBookPrintYn: boolean
  StudentWorkSheetYn: boolean
  WorkSheetPath: string
  */

export type DailySearchBook = {
  no: number
  topicTitle: string
  levelName: string
  levelRoundId: string
  surfaceImagePath: string
  studyImagePath: string
  preferenceAverage: number
  rgPointCount: number
  rgPointSum: number
  totalCount: number
  addYn: boolean
  seriesName: string
  addStudyCount: number
  todayStudyYn: boolean
  workSheetPath: string
  bookPoint: number
  animationPath: string
  workBookPrintYn: boolean
  studentWorkSheetYn: boolean
  recommendedAge: string
  getableRgPoint: number
}

function makeDailySearchBook(json: any): DailySearchBook {
  return {
    no: RenewType.renewNumber(json?.No),
    topicTitle: RenewType.renewString(json?.TopicTitle),
    levelName: RenewType.renewString(json?.LevelName),
    levelRoundId: RenewType.renewString(json?.LevelRoundId),
    surfaceImagePath: RenewType.renewString(json?.SurfaceImagePath),
    preferenceAverage: RenewType.renewNumber(json?.PreferenceAverage),
    rgPointCount: RenewType.renewNumber(json?.RgPointCount),
    rgPointSum: RenewType.renewNumber(json?.RgPointSum),
    totalCount: RenewType.renewNumber(json?.TotalCount),
    addYn: RenewType.renewBoolean(json?.AddYn),
    seriesName: RenewType.renewString(json?.SeriesName),
    addStudyCount: RenewType.renewNumber(json?.AddStudyCount),
    todayStudyYn: RenewType.renewBoolean(json?.TodayStudyYn),
    workSheetPath: RenewType.renewString(json?.WorkSheetPath),
    bookPoint: NumberUtils.toRgDecimalPoint(
      RenewType.renewNumber(json?.BookPoint),
    ),
    animationPath: RenewType.renewString(json?.AnimationPath),
    workBookPrintYn: RenewType.renewBoolean(json?.WorkBookPrintYn),
    studentWorkSheetYn: RenewType.renewBoolean(json?.StudentWorkSheetYn),
    studyImagePath: RenewType.renewString(json?.StudyImagePath),
    recommendedAge: RenewType.renewString(json?.RecommendedAge),
    getableRgPoint: RenewType.renewNumber(json?.GetableRgPoint),
  }
}

function transform(json: any): DailySearchBookResponse {
  return {
    book: json?.Books?.map((item: any) => makeDailySearchBook(item)),
  }
}

export type DailySearchBookParams = {
  stageId: string
  sectionId: string
}

export type DailySearchBookResponse = {
  book: DailySearchBook[]
  download?: string
}

export async function getDailySearchBook(
  input?: DailySearchBookParams,
): Promise<DailySearchBookResponse> {
  const request = makeRequest(`api/daily/search`, {
    method: 'get',
    queryString: {
      stageId: input?.stageId,
      sectionId: input?.sectionId,
    },
  })
  return await execute(request, transform)
}
