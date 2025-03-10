import { NotImplementedException } from '../exceptions'
import { uuid } from '../utils'

/**
 * 用于计算两个定位之间的距离，单位为米。
 * @param args
 */
export const DISTANCE = function (..._args: any[]) {
  throw new NotImplementedException()
}

/**
 * 函数用于获取当前用户的昵称。
 * @param args
 */
export const GETUSERNAME = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const INDEX = function (...args: any[]) {
  return args[0][args[1]]
}

export const MAPX = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const RECNO = function (..._args: any[]) {
  throw new NotImplementedException()
}

/**
 * 获取部门名称和部门编号。
 * @param args
 */
export const TEXTDEPT = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const TEXTUSER = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const TEXTLOCATION = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const TEXTPHONE = function (..._args: any[]) {
  throw new NotImplementedException()
}

export const UUID = function () {
  return uuid()
}
