export function AND(...args: any[]) {
  return args.reduce((prev, cur) => {
    return prev && !!cur
  }, true)
}

export function OR(...args: any[]) {
  return args.reduce((prev, cur) => {
    return prev || !!cur
  }, false)
}

export function FALSE() {
  return false
}

export function TRUE() {
  return true
}

export const IF = (condition: boolean, valueIfTrue: string, valueIfFalse: string) => {
  return condition ? valueIfTrue : valueIfFalse
}

export const IFS = (...args) => {
  for (let index = 0; index < args.length; index += 2) {
    if (args[index]) {
      const a = args[index + 1]
      return a
    }
  }
}

export const NOT = (logical: boolean) => {
  return !logical
}
/**
 * 异或运算
 * @param args boolean[]
 * @returns 如果两个逻辑值相同，返回 false, 如果两个逻辑值不同，返回 true
 */
export const XOR = function (...args: boolean[]) {
  if (args.length < 2) return true

  return args.reduce((prev, cur, i) => {
    if (i === 0) return prev
    return prev !== cur
  }, args[0])
}
