export function AND(...args: any[]) {
  return args.reduce((prev, cur) => {
    return prev && cur
  }, true)
}

export function OR(...args: any[]) {
  return args.reduce((prev, cur) => {
    return prev || cur
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

export const NOT = (...args) => {
  return !args[0]
}

export const XOR = function (...args: any[]) {
  return !!(args[0] ^ args[1])
}
