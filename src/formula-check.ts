const isUndefined = (s: any) => s === undefined
const isNull = (s: any) => s === null
const isNullUndefined = (s: any) => isUndefined(s) || isNull(s)

const isNumberType = (s) => 'number' === s

const isStringType = (s) => 'string' === s

const isBooleanType = (e) => 'boolean' === e

const isArrayType = (e) => Array.isArray(e) || 'array' === e

const isDateType = (e) => 'date' === e

const isAddressType = (e) => 'address' === e

const isPhoneType = (e) => 'phone' === e

const isUserType = (e) => 'id' === e

const isUserGroupType = (e) => 'idarray' === e

const isDeptType = (e) => 'did' === e

const isDeptGroupType = (e) => 'didarray' === e

const isAnyType = (e) => 'any' === e

type checkParamsTypeProps = {
  //
  isSupportDynamic?: boolean
  /**
   * 方法名称
   */
  name: string
  /**
   * 参数集合
   */
  params: any[]
  /**
   * 参数的最少数量
   */
  minCount?: number
  /**
   * 参数的最大数量，比如最多有三个参数
   */
  maxCount?: number
  /**
   * 参数类型，位置与参数位置对应
   */
  paramType?: any[]
  /**
   * 可选参数的数量
   */
  optionalCount?: number
  /**
   * 参数验证方法
   */
  checkFunction: (arg: any, argIndex: number, args: any[]) => boolean
}

function checkParamsType(obj: checkParamsTypeProps) {
  const { name, params, checkFunction, minCount, maxCount, paramType } = obj

  if (!isUndefined(minCount) && (isNullUndefined(params) || params.length < minCount!)) {
    throw new Error(JSON.stringify({ type: 'function', name, paramCount: minCount, errorType: 'minParamCount' }))
  }

  if (!isUndefined(maxCount) && (isNullUndefined(params) || params.length > maxCount!)) {
    throw new Error(JSON.stringify({ type: 'function', name, paramCount: maxCount, errorType: 'maxParamCount' }))
  }

  params.forEach((cur, index) => {
    if (!checkFunction(cur, index, params) && !isAnyType(cur)) {
      const message = JSON.stringify({
        type: 'function',
        name,
        paramIndex: index + 1,
        paramType, //
        errorType: 'paramType'
      })
      throw new Error(message)
    }
  })
}

export function AND(...args: any[]) {
  checkParamsType({
    name: 'AND',
    params: args,
    checkFunction: (e) => {
      return isBooleanType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['boolean', 'number'],
    isSupportDynamic: false
  })

  return 'boolean'
}

export function OR(...args: any[]) {
  checkParamsType({
    name: 'OR',
    params: args,
    checkFunction: (e) => {
      return isBooleanType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['boolean', 'number'],
    isSupportDynamic: false
  })

  return 'boolean'
}
export function TRUE(...args: any[]) {
  checkParamsType({
    name: 'TRUE',
    params: args,
    checkFunction: (_e) => {
      return true
    },
    maxCount: 0,
    isSupportDynamic: false
  })

  return 'boolean'
}

export const IF = (...args: any[]) => {
  checkParamsType({
    name: 'IF',
    params: args,
    checkFunction: (e, t) => {
      // console.log('checkFunction', 0 !== t || isBooleanType(e) || isNumberType(e))
      return 0 !== t || isBooleanType(e) || isNumberType(e)
    },
    minCount: 3,
    paramType: ['boolean', 'number']
  })
  return 'boolean'
}

export const IFS = (...args) => {
  checkParamsType({
    name: 'IFS',
    params: args,
    checkFunction: function (e, t) {
      return t % 2 !== 0 || isBooleanType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['boolean', 'number'],
    optionalCount: 252
  })

  return 'any'
}

export const NOT = (...args) => {
  checkParamsType({
    name: 'NOT',
    params: args,
    checkFunction: function (e, _t) {
      return isBooleanType(e)
    },
    minCount: 1,
    maxCount: 1
  })

  return 'boolean'
}

export const XOR = function (...args: any[]) {
  checkParamsType({
    name: 'XOR',
    params: args,
    checkFunction: function (e) {
      return isBooleanType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['boolean', 'number'],
    isSupportDynamic: !1
  })

  return 'boolean'
}

export const CHAR = (...args: any[]) => {
  // 函数可将计算机其他类型的数字代码转换为字符
  checkParamsType({
    name: 'CHAR',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'string'
}

export function CONCATENATE(...args: any[]) {
  checkParamsType({
    name: 'CONCATENATE',
    params: args,
    checkFunction: (e) => {
      return isStringType(e) || isNumberType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['string', 'number', 'array'],
    isSupportDynamic: false
  })

  return 'string'
}

export const EXACT = (...args: any[]) => {
  checkParamsType({
    name: 'EXACT',
    params: args,
    checkFunction: (e, _t, r) => {
      return r[0] === r[1] && (isStringType(e) || isNumberType(e))
    },
    minCount: 2,
    paramType: ['string', 'number']
  })
  return 'boolean'
}

export const ISEMPTY = (...args: any[]) => {
  checkParamsType({
    name: 'ISEMPTY',
    params: args,
    checkFunction: (e) => {
      return !isBooleanType(e)
    },
    minCount: 1
  })
  return 'boolean'
}

export const LEFT = (...args: any[]) => {
  checkParamsType({
    name: 'LEFT',
    params: args,
    checkFunction: (e, t) => {
      return 0 === t ? isStringType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['string', 'number']
  })

  return 'string'
}

export const RIGHT = function (...args: any[]) {
  checkParamsType({
    name: 'RIGHT',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['string', 'number']
  })
  return 'string'
}

export const LEN = function (...args: any[]) {
  checkParamsType({
    name: 'LEN',
    params: args,
    checkFunction: function (e) {
      return isStringType(e) || isArrayType(e) || isUserGroupType(e) || isDeptGroupType(e)
    },
    minCount: 1,
    paramType: ['string', 'array', 'idarray', 'didarray']
  })

  return 'number'
}

export const LOWER = function (...args: any[]) {
  checkParamsType({
    name: 'LOWER',
    params: args,
    checkFunction: function (e) {
      return isStringType(e)
    },
    minCount: 1,
    paramType: ['string']
  })
  return 'string'
}

export const UPPER = function (...args: any[]) {
  checkParamsType({
    name: 'UPPER',
    params: args,
    checkFunction: function (e) {
      return isStringType(e)
    },
    minCount: 1,
    paramType: ['string']
  })
  return 'string'
}
/**
 *
 * MID(text, start_num, num_chars)
 * 返回文本字符串中从指定位置开始的特定数目的字符，该数目由用户指定。
 */
export const MID = function (...args: any[]) {
  checkParamsType({
    name: 'MID',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 3,
    paramType: ['string', 'number']
  })

  return 'string'
}

export const REPLACE = function (...args: any[]) {
  // REPLACE(old_text, start_num, num_chars, new_text)
  checkParamsType({
    name: 'REPLACE',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t || 3 === t ? isStringType(e) : isNumberType(e)
    },
    minCount: 4,
    paramType: ['string', 'number']
  })
  return 'string'
}
/**
 * 将文本重复一定次数。
 * @param String text
 * @param Number number_times
 * @returns
 */
export const REPT = function (...args: any[]) {
  //
  checkParamsType({
    name: 'REPT',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 3,
    paramType: ['string', 'number']
  })
  return 'string'
}
/**
 * SEARCH(find_text,within_text,[start_num])
 * 返回第一个文本字符串在第二个文本字符串中第一次出现的位置序号，从左到右查找，忽略英文字母的大小写；返回 0 则表示未查找到。
 * @param args
 */
export const SEARCH = function (...args: any[]) {
  checkParamsType({
    name: 'SEARCH',
    params: args,
    checkFunction: function (e, t) {
      return t < 2 ? isStringType(e) : isStringType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['string', 'number'],
    optionalCount: 1
  })
  return 'number'
}

export const SPLIT = function (...args: any[]) {
  checkParamsType({
    name: 'SPLIT',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) : isStringType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['string', 'number']
  })

  return 'array'
}

export const TRIM = function (...args: any[]) {
  checkParamsType({
    name: 'TRIM',
    params: args,
    checkFunction: function (e) {
      return isStringType(e)
    },
    minCount: 1,
    paramType: ['string']
  })
  return 'string'
}

export const TEXT = function (...args: any[]) {
  checkParamsType({
    name: 'TEXT',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t || isStringType(e)
    },
    minCount: 1,
    paramType: ['string', 'number', 'date'],
    optionalCount: 1
  })

  return 'string'
}

export const UNION = function (...args: any[]) {
  checkParamsType({
    name: 'UNION',
    params: args,
    checkFunction: function (e) {
      return isStringType(e) || isNumberType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['string', 'number', 'array'],
    isSupportDynamic: !1
  })
  return 'array'
}

export const VALUE = function (...args: any[]) {
  checkParamsType({
    name: 'VALUE',
    params: args,
    checkFunction: function (e) {
      return isStringType(e)
    },
    minCount: 1,
    paramType: ['string']
  })
  return 'number'
}

export const JOIN = function (...args: any[]) {
  checkParamsType({
    name: 'JOIN',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t || isStringType(e)
    },
    minCount: 2,
    paramType: ['array', 'string']
  })
  return 'string'
}

export const ABS = function (...args: any[]) {
  checkParamsType({
    name: 'ABS',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const AVERAGE = function (...args: any[]) {
  checkParamsType({
    name: 'AVERAGE',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const COUNT = function (...args: any[]) {
  checkParamsType({
    name: 'COUNT',
    params: args,
    checkFunction: function () {
      return !0
    },
    minCount: 1,
    paramType: ['any'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const COUNTIF = function (...args: any[]) {
  checkParamsType({
    name: 'COUNTIF',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 2,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const CEILING = function (...args: any[]) {
  checkParamsType({
    name: 'CEILING',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string']
  })

  return 'number'
}

export const FLOOR = function (...args: any[]) {
  checkParamsType({
    name: 'FLOOR',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const FIXED = function (...args: any[]) {
  checkParamsType({
    name: 'FIXED',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string'],
    optionalCount: 1
  })

  return 'string'
}

export const INT = function (...args: any[]) {
  checkParamsType({
    name: 'INT',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const LARGE = function (...args: any[]) {
  checkParamsType({
    name: 'LARGE',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) || isArrayType(e) || isNumberType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string', 'array']
  })
  return 'number'
}

export const SMALL = function (...args: any[]) {
  checkParamsType({
    name: 'SMALL',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isStringType(e) || isArrayType(e) || isNumberType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string', 'array']
  })

  return 'number'
}

export const LOG = function (...args: any[]) {
  checkParamsType({
    name: 'LOG',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string'],
    optionalCount: 1
  })
  return 'number'
}

export const MOD = function (...args: any[]) {
  checkParamsType({
    name: 'MOD',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const MAX = function (...args: any[]) {
  checkParamsType({
    name: 'MAX',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const MIN = function (...args: any[]) {
  checkParamsType({
    name: 'MIN',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const POWER = function (...args: any[]) {
  checkParamsType({
    name: 'POWER',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const PRODUCT = function (...args: any[]) {
  checkParamsType({
    name: 'PRODUCT',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const ROUND = function (...args: any[]) {
  checkParamsType({
    name: 'ROUND',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const RAND = function (..._args: any[]) {
  return 'number'
}

export const SQRT = function (...args: any[]) {
  checkParamsType({
    name: 'SQRT',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string']
  })
  return 'number'
}

export const SUM = function (...args: any[]) {
  checkParamsType({
    name: 'SUM',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const SUMPRODUCT = function (...args: any[]) {
  checkParamsType({
    name: 'SUMPRODUCT',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'array'],
    isSupportDynamic: !1
  })
  return 'number'
}

export const SIN = function (...args: any[]) {
  checkParamsType({
    name: 'SIN',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'number'
}

export const COS = function (...args: any[]) {
  checkParamsType({
    name: 'COS',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'number'
}

export const TAN = function (...args: any[]) {
  checkParamsType({
    name: 'TAN',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'number'
}

export const COT = function (...args: any[]) {
  checkParamsType({
    name: 'COT',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'number'
}

export const RADIANS = function (...args: any[]) {
  checkParamsType({
    name: 'RADIANS',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e)
    },
    minCount: 1,
    paramType: ['number']
  })
  return 'number'
}

export const RMBCAP = function (...args: any[]) {
  checkParamsType({
    name: 'RMBCAP',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string']
  })
  return 'string'
}

export const DATE = function (...args: any[]) {
  checkParamsType({
    name: 'DATE',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 0,
    paramType: ['number', 'date'],
    optionalCount: 6
  })

  return 'date'
}

export const YEAR = function (...args: any[]) {
  checkParamsType({
    name: 'YEAR',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const MONTH = function (...args: any[]) {
  checkParamsType({
    name: 'MONTH',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const DAY = function (...args: any[]) {
  checkParamsType({
    name: 'DAY',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const HOUR = function (...args: any[]) {
  checkParamsType({
    name: 'HOUR',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const MINUTE = function (...args: any[]) {
  checkParamsType({
    name: 'MINUTE',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const SECOND = function (...args: any[]) {
  checkParamsType({
    name: 'SECOND',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const DAYS = function (...args: any[]) {
  checkParamsType({
    name: 'DAYS',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 2,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const DAYS360 = function (...args: any[]) {
  checkParamsType({
    name: 'DAYS360',
    params: args,
    checkFunction: function (e, t) {
      return 2 === t ? isBooleanType(e) : isNumberType(e) || isDateType(e)
    },
    minCount: 2,
    paramType: ['number', 'boolean', 'date'],
    optionalCount: 1
  })
  return 'number'
}

export const DATEDIF = function (...args: any[]) {
  checkParamsType({
    name: 'DATEDIF',
    params: args,
    checkFunction: function (e, t) {
      return 2 === t ? isStringType(e) : isNumberType(e) || isDateType(e)
    },
    minCount: 2,
    paramType: ['number', 'string', 'date'],
    optionalCount: 1
  })
  return 'number'
}

export const DATEDELTA = function (...args: any[]) {
  checkParamsType({
    name: 'DATEDELTA',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isNumberType(e) || isDateType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 2,
    paramType: ['number', 'string', 'date']
  })
  return 'date'
}

export const ISOWEEKNUM = function (...args: any[]) {
  checkParamsType({
    name: 'ISOWEEKNUM',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const NOW = function (..._args: any[]) {
  return 'date'
}

export const NETWORKDAYS = function (...args: any[]) {
  checkParamsType({
    name: 'NETWORKDAYS',
    params: args,
    checkFunction: function (e, t) {
      return 2 === t ? isArrayType(e) || isNumberType(e) : isNumberType(e) || isDateType(e)
    },
    minCount: 2,
    paramType: ['number', 'date', 'array'],
    optionalCount: 1
  })
  return 'number'
}

export const TIMESTAMP = function (...args: any[]) {
  checkParamsType({
    name: 'TIMESTAMP',
    params: args,
    checkFunction: function (e) {
      return isDateType(e)
    },
    minCount: 1,
    paramType: ['date']
  })

  return 'number'
}

export const TIME = function (...args: any[]) {
  checkParamsType({
    name: 'TIME',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e)
    },
    minCount: 3,
    paramType: ['number', 'string']
  })

  return 'number'
}

export const TODAY = function (..._args: any[]) {
  return 'date'
}

export const WORKDAY = function (...args: any[]) {
  checkParamsType({
    name: 'WORKDAY',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t
        ? isNumberType(e) || isDateType(e)
        : 1 === t
          ? isNumberType(e) || isStringType(e)
          : isArrayType(e) || isNumberType(e)
    },
    minCount: 2,
    paramType: ['number', 'date', 'string'],
    optionalCount: 1
  })
  return 'date'
}

export const WEEKNUM = function (...args: any[]) {
  checkParamsType({
    name: 'WEEKNUM',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isNumberType(e) || isDateType(e) : isNumberType(e) || isStringType(e)
    },
    minCount: 1,
    paramType: ['number', 'string', 'date'],
    optionalCount: 1
  })
  return 'number'
}

export const WEEKDAY = function (...args: any[]) {
  checkParamsType({
    name: 'WEEKDAY',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isDateType(e)
    },
    minCount: 1,
    paramType: ['number', 'date']
  })
  return 'number'
}

export const DISTANCE = function (...args: any[]) {
  checkParamsType({
    name: 'DISTANCE',
    params: args,
    checkFunction: function (e) {
      return isAddressType(e)
    },
    minCount: 2,
    paramType: ['address']
  })
  return 'number'
}

export const TEXTDEPT = function (...args: any[]) {
  checkParamsType({
    name: 'TEXTDEPT',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isDeptType(e) : isStringType(e)
    },
    minCount: 2,
    paramType: ['did', 'string']
  })
  return 'string'
}

export const TEXTUSER = function (...args: any[]) {
  checkParamsType({
    name: 'TEXTUSER',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isUserType(e) : isStringType(e)
    },
    minCount: 2,
    paramType: ['id', 'string']
  })
  return 'string'
}

export const TEXTLOCATION = function (...args: any[]) {
  checkParamsType({
    name: 'TEXTLOCATION',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isAddressType(e) : isStringType(e)
    },
    minCount: 2,
    paramType: ['address', 'string']
  })
  return 'string'
}

export const TEXTPHONE = function (...args: any[]) {
  checkParamsType({
    name: 'TEXTPHONE',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t ? isPhoneType(e) : isStringType(e)
    },
    minCount: 2,
    paramType: ['phone', 'string']
  })
  return 'any'
}

export const UUID = function () {
  return 'string'
}

export const INDEX = function (...args: any[]) {
  checkParamsType({
    name: 'INDEX',
    params: args,
    checkFunction: function (e, t) {
      return 0 === t || isNumberType(e)
    },
    minCount: 2,
    paramType: ['array', 'number']
  })
  return 'any'
}

export const SUMIF = function (...args: any[]) {
  checkParamsType({
    name: 'SUMIF',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 2,
    paramType: ['string', 'number', 'array'],
    optionalCount: 1
  })
  return 'number'
}

export const SUMIFS = function (...args: any[]) {
  checkParamsType({
    name: 'SUMIFS',
    params: args,
    checkFunction: function (e) {
      return isNumberType(e) || isStringType(e) || isArrayType(e)
    },
    minCount: 3,
    paramType: ['string', 'number', 'array'],
    optionalCount: 252
  })

  return 'number'
}

export const ADD = (...params: any[]) => {
  checkParamsType({
    name: 'ADD',
    params,
    minCount: 2,
    maxCount: 2,
    paramType: ['number'],
    checkFunction: function (e) {
      return isNumberType(e)
    }
    // isSupportDynamic: !1,
  })

  return 'string'
}
