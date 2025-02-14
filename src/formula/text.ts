import dayjs from 'dayjs'
import { isDate, isNull, isNullUndefined, isObject, isString, numberToChinese } from '../utils'
import { NotImplementedException } from '../exceptions'

const DATE_COMMON_FORMAT = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'

export function CONCATENATE(...args: any[]) {
  return args
    .filter((m) => !isNullUndefined(m)) //
    .map((m) => (m === true ? 'TRUE' : m === false ? 'FALSE' : String(m)))
    .join('')
}

export const CHAR = (...args: any[]) => {
  // 函数可将计算机其他类型的数字代码转换为字符
  const e = args[0]
  return 9 === e || 10 === e || 34 === e || 39 === e || 92 === e ? String.fromCharCode(e) : ''
}

export const EXACT = (...args: any[]) => {
  return args[0] === args[1]
}

export const IP = (...args: any[]) => {
  throw new NotImplementedException()
}

export const ISEMPTY = (value: any) => {
  if (isNullUndefined(value)) return true // undefined null
  if (Array.isArray(value)) return value.length === 0 // []
  if (isObject(value)) return Object.keys(value).length === 0 // {}
  if (isString(value)) return value === '' // 空字符串

  return false
}

export const JOIN = function (arrToJoin, joiner) {
  return Array.isArray(arrToJoin) && isString(joiner) ? arrToJoin.join(joiner.valueOf()) : ''
}

export const LEFT = (...args: any[]) => {
  var r = isNull(args[1]) ? 1 : args[0]
  return args[0] ? args[0].substring(0, r) : ''
}

export const LEN = function (...args: any[]) {
  const s = args[0]

  if (isString(s)) return s.length
  if (s && s.length) return s.length
  return 0
}

export const LOWER = function (...args: any[]) {
  const s = args[0]

  return isString(s) ? s.toLowerCase() : ''
}

/**
 *
 * MID(text, start_num, num_chars)
 * 返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定。
 */
export const MID = function (...args: any[]) {
  const [text, start, len] = args
  return (text || '').slice(start, start + len)
}

export const REPLACE = function (...args: any[]) {
  // REPLACE(old_text, start_num, num_chars, new_text)

  const [old_text, start_num, num_chars, new_text] = args
  return old_text.slice(0, start_num) + new_text + old_text.slice(start_num + num_chars)
}
/**
 * 将文本重复一定次数。
 * @param String text
 * @param Number number_times
 * @returns
 */
export const REPT = function (...args: any[]) {
  //

  const [text, times] = args
  return new Array(times).fill(text).join('')
}

export const RIGHT = function (...args: any[]) {
  const t = isNullUndefined(args[1]) ? 1 : args[1]
  return args[0] ? args[0].substring(args[0].length - t) : ''
}

/* 数字转人民币大写 */
export const RMBCAP = function (inputNumber: any) {
  return numberToChinese(inputNumber, 2)
}

/**
 * SEARCH(find_text,within_text,[start_num])
 * 返回第一个文本字符串在第二个文本字符串中第一次出现的位置序号，从左到右查找，忽略英文字母的大小写；返回 0 则表示未查找到。
 * @param args
 */
export const SEARCH = function (find_text: string, within_text: string, start_num?: number) {
  // const [find_text, within_text, start_num] = args
  if (!isString(find_text) || !isString(within_text)) return 0

  const res = find_text
    .slice(start_num || 0)
    .toLowerCase()
    .indexOf(within_text as string)

  return res === -1 ? 0 : res
}

export const SPLIT = function (...args: any[]) {
  const [text, separator] = args
  return (text || '').split(separator)
}

export const TRIM = function (...args: any[]) {
  return args[0].trim()
}

export const TEXT = function (numOrDate: number | Date, format: string) {
  if (isNullUndefined(numOrDate)) return ''

  if (isDate(numOrDate) || dayjs.isDayjs(numOrDate)) {
    if (isNullUndefined(format)) return dayjs(numOrDate).format(DATE_COMMON_FORMAT)
    return dayjs(numOrDate).format(format.replace(/y/g, 'Y'))
  }

  if (format === '[Num0]') return numOrDate
  if (format === '[Num1]') return numberToChinese(numOrDate, 0) // 中文小写
  if (format === '[Num2]') return numberToChinese(numOrDate, 1) // 中文大写
  if (format === '[Num3]') return numberToChinese(numOrDate, 2) // 中文金额大写

  if (!format) return String(numOrDate)

  const getConf = (format) => {
    const [integerPart, decimalPart] = format.split('.')
    const match = decimalPart.match(/^([#|0]*)(.*)?/)
    const precision = match[1].length
    const suffix = match[2]
    const prefix = integerPart.match(/[^(#|0)]*/)
    const needSep = integerPart.includes(',')
    return { precision, suffix, prefix, needSep }
  }

  const match = format.match(/[#0]+,?[#0]*\.?[#0]*%?/)

  if (match && match.length > 0) {
    const { precision, suffix, prefix, needSep } = getConf(format)
    const numStr = Number(numOrDate).toFixed(precision).toString()
    let [part1, part2] = numStr.split('.')

    if (needSep) {
      part1 = part1.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      part2 = part2.replace(/(\d{3}(?!$))/g, '$1,')
    }

    return [prefix, part1, '.', part2, suffix].join('')
  }

  return numOrDate
}

export const UPPER = function (...args: any[]) {
  const s = args[0]
  return isString(s) ? s.toUpperCase() : ''
}

export const UNION = function (...args: any[]) {
  let argsArr: any[] = []

  if (Array.isArray(args[0])) {
    if (args.length === 0) {
      return []
    }
    argsArr = args[0]
  } else {
    argsArr = args
  }

  return [...Array.from(new Set(argsArr))]
}

export const VALUE = function (...args: any[]) {
  const e = args[0]
  return '' === e || isNull(e) || isNaN(e) ? 0 : parseFloat(e)
}
