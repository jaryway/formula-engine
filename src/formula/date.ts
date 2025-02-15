import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import { isNumber, isString } from '../utils'
import { NotImplementedException } from '../exceptions'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)
dayjs.extend(isoWeek)

const DATE_COMMON_FORMAT = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'
// const DATE_YMD_FORMAT = 'YYYY-MM-DD'

/* 转换为日期 */
export const DATE = function (...args: any[]) {
  if (args.length === 1) {
    if (isNumber(args[0]) || isString(args[0])) {
      return dayjs(args[0].valueOf()).format(DATE_COMMON_FORMAT)
    }
  }

  if (args.length >= 3 && args.length <= 6) {
    const [year, month, ...rest] = args
    return dayjs(new Date(year, month - 1, ...rest)).format(DATE_COMMON_FORMAT)
  }
}

export const DAY = function (...args: any[]) {
  return dayjs(args[0].valueOf()).date().toString()
}

/* 天数差 */
export const DAYS = function (...args: any[]) {
  return dayjs(args[0].valueOf()).diff(dayjs(args[1].valueOf()), 'days').toString()
}
// TODO
export const DAYS360 = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const DATEDIF = function (...args: any[]) {
  return dayjs(args[0].valueOf())
    .diff(dayjs(args[1].valueOf()), args[2] || 'days')
    .toString()
}

export const DATEDELTA = function (...args: any[]) {
  return dayjs(args[0].valueOf()).add(args[1], 'days').format(DATE_COMMON_FORMAT)
}

export const HOUR = function (...args: any[]) {
  return dayjs(args[0].valueOf()).hour().toString()
}

export const ISOWEEKNUM = function (date: any) {
  return dayjs(date).isoWeek()
}

export const MINUTE = function (...args: any[]) {
  return dayjs(args[0].valueOf()).minute().toString()
}

export const MONTH = function (...args: any[]) {
  return (dayjs(args[0].valueOf()).month() + 1).toString()
}

// TODO
export const NETWORKDAYS = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const NOW = function () {
  return dayjs().format(DATE_COMMON_FORMAT)
}

// TODO
export const SYSTIME = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const SECOND = function (...args: any[]) {
  return dayjs(args[0].valueOf()).second().toString()
}

export const TIMESTAMP = function (...args: any[]) {
  return dayjs(args[0]).format(DATE_COMMON_FORMAT)
}
// TODO
export const TIME = function (hour: number, minute: number, second: number) {
  const hdays = (~~hour < 0 ? 0 : ~~hour) / 24
  const mdays = (~~minute < 0 ? 0 : ~~minute) / 24 / 60
  const sdays = (~~second < 0 ? 0 : ~~second) / 24 / 60 / 60
  return hdays + mdays + sdays
}

export const TODAY = function () {
  return dayjs().format(DATE_COMMON_FORMAT)
}

export const WEEKDAY = function (...args: any[]) {
  return dayjs(args[0].valueOf()).day().toString()
}

export const WEEKNUM = function (timestamp, returnType = 1) {
  const returnTypeArr = { 1: 0, 2: 1, 11: 1, 12: 2, 13: 3, 14: 4, 15: 5, 16: 6, 17: 0 }
  const returnTypeNum = returnTypeArr[returnType]
  const timestampStart = dayjs(new Date(dayjs(timestamp).year(), 0, 1)).valueOf()
  const n = (returnTypeNum + 7 - dayjs(timestampStart).day()) % 7 // 当周第几天
  const currentWeekCount = n > 0 ? 1 : 0 // 时间戳当前算不算新的一周
  const c = timestampStart + 24 * n * 60 * 60 * 1e3
  return Math.floor((timestamp - c) / (24 * 60 * 60 * 1e3) / 7 + 1) + currentWeekCount
}

/**
 * 计算在某日期（起始日期）之前或之后、与该日期相隔指定工作日的某一日期的日期值。 工作日不包括周末和专门指定的假日。
 * @param start_timestamp
 * @param days 所需工作天数
 * @param holidays 节假日
 * @returns 日期值
 */
export const WORKDAY = function (start_timestamp: Date, days: number, holidays: any[]) {
  const start = dayjs(start_timestamp)
  const safeDays = days || 0
  let i = 0

  while (i < safeDays) {
    const date = dayjs(start).add(i, 'day')
    if ([0, 6].includes(date.day())) continue //排除周末
    if ((holidays || []).some((m) => date.diff(m, 'day') === 0)) continue // 排除节假日
    i++
  }

  return dayjs(start).add(i).format(DATE_COMMON_FORMAT)
}

export const YEAR = function (...args: any[]) {
  return dayjs(args[0].valueOf()).year().toString()
}
