import Big from 'big.js'
import { isNull, isNullUndefined, isNumber, isNumeric, makeArray, parseNumber, radians } from '../utils'

function flatten(arr) {
  return arr.reduce((prev, cur) => {
    return Array.isArray(cur) ? [...prev, ...flatten(cur)] : [...prev, cur]
  }, [])
}

export const ABS = function (e: any) {
  return isNumber(e) ? Math.abs(e.valueOf()) : 0
}

export const AVERAGE = function (...args: any[]) {
  // console.log('AVERAGE')
  const arr = flatten(args)
  const numArray = arr.filter((e) => isNumber(e))
  const [sum, count]: [Big, number] = numArray.reduce(
    ([sum, count], cur: number) => {
      sum = sum.plus(Big(parseNumber(cur) || 0))
      count += 1
      return [sum, count]
    },
    [Big(0), 0]
  )

  if (count === 0) return 0

  return sum.div(count).toNumber()
}

/* CEILING 将参数 number 向上/向下舍入为最接近的指定基数的倍数 */
export const CEILING = function (number, significance) {
  let mode = 0
  significance = significance === undefined ? 1 : significance

  if (significance === 0) {
    return 0
  }

  if (number < 0 && significance < 0) {
    mode = 1
  }

  significance = Math.abs(significance)
  if (number >= 0) {
    return Math.ceil(number / significance) * significance
  } else {
    if (mode === 0) {
      return -1 * Math.floor(Math.abs(number) / significance) * significance
    } else {
      return -1 * Math.ceil(Math.abs(number) / significance) * significance
    }
  }
}
/* 余弦函数 */
export const COS = function (a: number | string) {
  const angle = parseNumber(a) || 0
  return Number(Math.cos(radians(angle)).toFixed(8))
}

/* 余切 */
export const COT = function (a: number | string) {
  const angle = parseNumber(a) || 0
  return Number((1 / Math.tan(radians(angle))).toFixed(8))
}

export const COUNT = function (...args: any[]) {
  // 如果是多个参数直接返回参数长度
  if (args.length > 1) {
    return args.length
  }
  // 否则将数组打平
  return flatten(args).length
}

export const COUNTIF = function (range, criteria) {
  if (!/[<>=!]/.test(criteria)) {
    criteria = '=="' + criteria + '"'
  }
  let matches = 0
  for (let i = 0; i < range.length; i++) {
    if (typeof range[i] !== 'string') {
      if (eval(range[i] + criteria)) {
        matches++
      }
    } else {
      if (eval('"' + range[i] + '"' + criteria)) {
        matches++
      }
    }
  }
  return matches
}

/* FLOOR 将参数 number 向下舍入为最接近的 significance 的倍数。 */
export const FLOOR = function (number, significance) {
  let mode = 0
  significance = significance === undefined ? 1 : significance

  number = parseNumber(number)
  significance = parseNumber(significance)

  if (significance === 0) {
    return 0
  }

  if (number < 0 && significance < 0) {
    mode = 1
  }

  significance = Math.abs(significance)
  if (number >= 0) {
    return Math.floor(number / significance) * significance
  } else {
    if (mode === 0) {
      return -1 * Math.ceil(Math.abs(number) / significance) * significance
    } else {
      return -1 * Math.floor(Math.abs(number) / significance) * significance
    }
  }
}

/* 
  将数字舍入到指定的小数位数，以十进制数格式对该数进行格式设置，并以文本形式返回结果。

  number: 必需。 要进行舍入并转换为文本的数字。

  decimals: 可选。 小数点右边的位数。 
*/
export const FIXED = function (number, decimals) {
  const r = parseNumber(number)

  const s = decimals === undefined ? 0 : decimals
  return isNull(r) ? NaN : new Big(r || 0).toFixed(s).toString()
}

/* 将数字向下舍入到最接近的整数 */
export const INT = function (e) {
  return isNumber(e) ? Math.floor(e.valueOf()) : 0
}

/* 第n个最大数 */
export const LARGE = function (arr: number[], index: number) {
  const arrFiltered = arr.filter((item) => isNumber(item))
  arrFiltered.sort((a, b) => b - a)
  const indexWithin = (index - 1) % arr.length
  return arrFiltered[indexWithin]
}

export const LOG = function (number, base) {
  number = parseNumber(number)
  base = base === undefined ? 10 : parseNumber(base)

  return Math.log(number) / Math.log(base)
}

/**
 * 求余数
 * @param dividend 要计算余数的被除数
 * @param divisor 除数
 * @returns 返回两数相除的余数
 */
export const MOD = function (dividend: number, divisor: number) {
  const num1 = parseNumber(dividend)
  const num2 = parseNumber(divisor)
  if (num2 === 0) {
    return NaN
  }
  const num = Math.abs(num1 % num2)
  return num2 > 0 ? num : -num
}

export const MAX = function (...args: any[]) {
  const nums = args.filter((item) => isNumber(item))
  return 0 === nums.length ? 0 : Math.max(...nums)
}

export const MIN = function (...args: any[]) {
  const nums = args.filter((item) => isNumber(item))
  return 0 === nums.length ? 0 : Math.min(...nums)
}

export const POWER = function (number, power) {
  number = parseNumber(number)
  power = parseNumber(power)
  const result = Math.pow(number, power)

  return result
}

/* 求乘积 */
export const PRODUCT = function (...args: number[]) {
  const arrFiltered = flatten(args).filter((m) => isNumber(m))
  // console.log('arrFiltered', args, arrFiltered);
  if (!arrFiltered.length) return 0

  const result = arrFiltered.reduce((prev, curr) => {
    return prev * curr
  }, 1)
  return result
}

export const RADIANS = function (a: any) {
  return Number(radians(a).toFixed(8))
}

/* 0~1随机数 */
export const RAND = function () {
  return Math.random()
}

/* 将数字a四舍五入到指定的位数b */
export const ROUND = function (a: number | string, b: number | string) {
  const num = parseNumber(a) || 0
  const digits = parseNumber(b) || 0
  return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)
}

/* 正弦函数 */
export const SIN = function (a: number | string) {
  const angle = parseNumber(a) || 0
  return Number(Math.sin(radians(angle)).toFixed(8))
}

/* 第n个最小数 */
export const SMALL = function (arr: number[], index: number) {
  const arrFiltered = arr.filter((item) => isNumber(item))
  arrFiltered.sort((a, b) => a - b)
  const indexWithin = (index - 1) % arr.length
  return arrFiltered[indexWithin]
}

/* 正平方根 */
export const SQRT = function (a: number | string) {
  const num = parseNumber(a) || 0
  return num < 0 ? 0 : Math.sqrt(num)
}

/* 求和 */
export const SUM = function (...args) {
  // console.log('SUMSUMSUMSUM', args)
  const res: Big = flatten(args)
    .filter((item: any) => {
      return isNumeric(item)
    })
    .reduce(
      (prev: Big, cur: any) => {
        return prev.plus(Big(parseFloat(cur))) as Big
      },
      Big(0) as Big
    )

  return res.toNumber()
}

/**
 * 用于计算子表单中满足某一条件的数字相加并返回和
 * @param values 子表单某列的值
 * @param criteria
 * @param sum_range
 * @returns
 */
export const SUMIF = function (range: string[], criteria: string, sum_range: number[]) {
  // SUMIF(入库明细.产品类型,"水果",入库明细.数量)
  // SUMIF(["水果","蔬菜"，"面食"],"水果",[30,25,90])
  const _sum_range = isNullUndefined(sum_range) ? range : sum_range
  const final_range = makeArray(range)
  const final_sum_range = makeArray(_sum_range)

  if (final_range.length !== final_sum_range.length) return null
  if (isNullUndefined(criteria) || criteria === '') return 0

  return final_range.reduce((prev, cur, index) => {
    const sum_value = final_sum_range[index]
    // 条件成立并且
    if (cur === criteria) return prev + ~~sum_value

    return prev
  }, 0)
}

export const SUMIFS = function (range: any[], ...args: any[]) {
  // SUMIFS(入库明细.数量,入库明细.水果名称,"苹果",入库明细.水果种类,"红富士")
  // SUMIFS([1, 2, 3, 4], ['苹果', '葡萄', '苹果', '香蕉'], '苹果', ['红富士', '红星', '红富士', '夏黑'], '红富士')

  function getConditions() {
    const result: Array<[any, any]> = []
    let index = 0

    while (index < args.length) {
      result.push([args[index], args[index + 1]])
      index = index + 2
    }

    return result
  }

  const conditionsList = getConditions()

  return (range || []).reduce((prev, cur, index) => {
    const result = conditionsList.every((m) => {
      const [conditions, criteria] = m
      return conditions[index] === criteria
    })

    if (result) return prev + ~~cur

    return prev
  }, 0)
}

/* 数组对应位置元素的乘积之和 */
export const SUMPRODUCT = function (...args: Array<number[]>) {
  const max = Math.max(...args.map((m) => m.length))
  let result = 0
  for (let i = 0; i < max; i++) {
    const product = args.reduce(
      (prev, cur) => {
        const num = cur[i]
        if (isNullUndefined(num) || !isNumber(num)) return prev
        if (prev === undefined) return num
        return prev * num
      },
      undefined as number | undefined
    )

    result += product === undefined ? 0 : product
  }

  return result
}

/* 正切 */
export const TAN = function (a: number | string) {
  const angle = parseNumber(a) || 0
  return Number(Math.tan(radians(angle)).toFixed(8))
}
