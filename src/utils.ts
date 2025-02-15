import Big from 'big.js'

const toString = Object.prototype.toString
const isType = <T>(type: string | string[]) => {
  return (obj: unknown): obj is T => {
    return getType(obj) === `[object ${type}]`
  }
}

export const isUndefined = (s: any) => s === undefined
export const isNull = (s: any) => s === null
export const isNullUndefined = (s: any) => isUndefined(s) || isNull(s)
export const getType = (obj: any) => toString.call(obj)
export const isDate = isType<Date>('Date')
export const isString = isType<string>('String')
export const isObject = isType<object>('Object')
export const isNumber = isType<number>('Number')
export const isNumeric = (e: any) => {
  const t = e && e.toString()
  return !Array.isArray(e) && t - parseFloat(t) + 1 >= 0
}
export const isBoolean = isType<boolean>('Boolean')
export const parseNumber = function (e: any) {
  const num = parseFloat(e)
  return !isNaN(num) && isFinite(num) ? num : null
}

/* 根据角度求弧度 */
export const radians = function (a: any) {
  const angle = parseNumber(a) || 0
  return Number(Big(angle * Math.PI).div(180))
}

export function uuid(match?: any) {
  if (match) return (match ^ ((16 * Math.random()) >> (match / 4))).toString(16)
  return [1e7, 1e3, 4e3, 8e3, 1e11].join('-').replace(/[018]/g, uuid)
}

export function numberToChinese(num: number, t: number = 0) {
  const configs = {
    0: { ch: '〇一二三四五六七八九', ch_u: '个十百千万亿', ch_f: '负', ch_d: '点', m_u: '', m_z: '' },
    1: { ch: '零壹贰叁肆伍陆柒捌玖', ch_u: '个拾佰仟万亿', ch_f: '负', ch_d: '点', m_u: '', m_z: '' },
    2: { ch: '零壹贰叁肆伍陆柒捌玖', ch_u: '个拾佰仟万亿', ch_f: '负', ch_d: '', m_u: '元角分厘', m_z: '整' }
  }
  // 0、转成中文小写，123.4567 显示为一百二十三点四五六七；
  // 1、转成中文大写，123.4567 显示为壹佰贰十叁点肆伍陆柒；
  // 2、转成中文金额大写，金额大写只能显示小数点后2位，123.4567 显示为壹佰贰十叁元肆角伍分；
  const config = configs[t]
  const chineseNums = config.ch
  const chineseUnits = config.ch_u
  const moneyUnits = config.m_u

  const isMoney = config.m_u.length > 0
  const decimals = (isMoney ? Math.abs(num).toFixed(2) : Math.abs(num)).toString().split('.')
  const [integerPart, decimalPart] = decimals
  const zero = config.ch[0]
  const reg1 = new RegExp(`${zero}+`, 'g')
  const reg2 = new RegExp(`${zero}*$`)

  const negativeChar: string = num < 0 ? config.ch_f : ''

  const arr: any[] = ['', '', '']
  for (let i = 0; i < integerPart.length; i++) {
    const cur = integerPart[integerPart.length - 1 - i]
    const idx = 3 - Math.ceil((i + 1) / 4)
    const safeIdx = idx < 0 ? 0 : idx
    const prev = arr[safeIdx]
    arr[safeIdx] = cur + prev
  }

  let result = arr
    .map((item) => {
      let res = ''
      if (item === '0000') return res
      for (let i = 0; i < item.length; i++) {
        const temp = item.length - i - 1
        const unit = temp ? chineseUnits[temp] : ''
        const digit = Number(item[i])
        const cdigit = chineseNums[digit]
        res += digit === 0 ? cdigit : cdigit + unit
      }
      res = res.replace(reg1, zero).replace(reg2, '')
      return res
    })
    .reduce((prev, cur, i) => {
      if (!cur) return prev
      if (i === 2) return prev + cur
      if (i === 1) return prev + cur + chineseUnits[4]
      return prev + cur + chineseUnits[5]
    }, '')

  result = result || zero
  const decimalPart1 = (decimalPart || '').replace(/0*$/, '')

  let result1 = ''
  for (let i = 0; i < decimalPart1.length; i++) {
    const digit = parseInt(decimalPart1[i])
    result1 += [chineseNums[digit], moneyUnits[i + 1]].join('')
  }

  result1 = result1.replace(new RegExp(`${zero}*$`), '')

  if (!result1) return negativeChar + [result, config.m_u[0], config.m_z].join('')
  result += [config.m_u[0], config.ch_d].join('')

  return negativeChar + result + result1
}

export const makeArray = (s: any) => {
  if (isNullUndefined(s)) return []
  if (Array.isArray(s)) return s
  return [s]
}
