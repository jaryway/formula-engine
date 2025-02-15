import { CstNode, tokenMatcher } from 'chevrotain'
import Big from 'big.js'
import getIn from 'lodash/get'
import { ExecutionError, FunctionError } from './exceptions'
import { tokens } from './lexer'
import { FormulaParser } from './parser'

const toTag = function (e) {
  return Object.prototype.toString.call(e)
}

const isDate = (e: any): e is Date => '[object Date]' === toTag(e)
const isString = (e: any): e is string => '[object String]' === toTag(e)
const isNumber = (e: any): e is number => '[object Number]' === toTag(e)
const isBoolean = (e: any): e is boolean => '[object Boolean]' === toTag(e)
const isNumeric = (e: any) => {
  const t = e && e.toString()
  return !Array.isArray(e) && t - parseFloat(t) + 1 >= 0
}

const isNumberType = (s: any) => s === 'number'
const isStringType = (s: any) => s === 'string'
export interface IVisitor {
  visit(cst: CstNode, state: any): any
}

const throwUnknownOperatorError = (operator, ctx) => {
  throw new ExecutionError(`Unknown operator: ${operator.image} at ${operator.startOffset}`, {
    operator,
    context: ctx
  })
}

export function createEvalVisitor(parser: FormulaParser, functions: any, mode: 'check' | 'eval' = 'eval'): IVisitor {
  const FormulaVisitorBase = parser.getBaseCstVisitorConstructorWithDefaults()

  class InterpreterVisitor extends FormulaVisitorBase {
    constructor() {
      super()
      this.validateVisitor()
    }

    expression(ctx, state): any {
      return this.visit(ctx.commaExpression, state)
    }

    commaExpression(ctx, state) {
      return this.visit(ctx.logicalExpression, state)
    }

    logicalExpression(ctx, state) {
      const left = this.visit(ctx.lhs, state)
      if (!ctx.rhs) return left

      return ctx.rhs.reduce((prev: number, cur, i) => {
        const operator = ctx.LogicalOperator[i]
        const value = this.visit(cur, state)

        if (tokenMatcher(operator, tokens.LogicalAnd)) return prev && value
        if (tokenMatcher(operator, tokens.LogicalOr)) return prev || value

        return prev
      }, left || 0)
    }

    comparisonExpression(ctx, state): any {
      const left = this.visit(ctx.lhs, state)
      if (!ctx.rhs) return left

      // console.log('comparisonExpression', left)

      const reuslt = ctx.rhs.reduce((prev: number, cur, i) => {
        const operator = ctx.ComparisonOperator[i]
        const value = this.visit(cur, state)

        if (tokenMatcher(operator, tokens.EqualLoose)) return prev == value
        if (tokenMatcher(operator, tokens.NotEqualLoose)) return prev != value
        if (tokenMatcher(operator, tokens.EqualStrict)) return prev === value
        if (tokenMatcher(operator, tokens.NotEqualStrict)) return prev !== value
        if (tokenMatcher(operator, tokens.Greater)) return prev > value
        if (tokenMatcher(operator, tokens.GreaterOrEqual)) return prev >= value
        if (tokenMatcher(operator, tokens.Less)) return prev < value
        if (tokenMatcher(operator, tokens.LessOrEqual)) return prev <= value
        if (tokenMatcher(operator, tokens.BitwiseAnd)) return prev & value
        if (tokenMatcher(operator, tokens.BitwiseOr)) return prev | value

        throwUnknownOperatorError(operator, ctx)

        return prev
      }, left || 0)

      if (mode === 'check') {
        if (isDate(reuslt)) return 'date'
        if (isString(reuslt)) return 'string'
        if (isNumber(reuslt)) return 'number'
        if (isBoolean(reuslt)) return 'boolean'
      }

      return reuslt
    }

    additionExpression(ctx, state): any {
      const left = this.visit(ctx.lhs, state)
      if (!ctx.rhs) return left

      if (mode === 'check') {
        if (!isNumberType(left) && !isStringType(left))
          throw new ExecutionError('additionExpression: lhs is not a number or string', {})

        return ctx.rhs.reduce((prev: number, cur: CstNode | CstNode[], i: string | number) => {
          const operator = ctx.AdditionOperator[i]
          const value = this.visit(cur, state)

          if (tokenMatcher(operator, tokens.Addition)) {
            if (!isNumberType(value) && !isStringType(value))
              throw new ExecutionError('Addition: rhs is not a number or string', {})
            if (isStringType(value) || isStringType(prev)) return 'string'
            return 'number'
          }

          if (tokenMatcher(operator, tokens.Subtraction)) {
            if (!isNumberType(prev)) throw new ExecutionError('Subtraction: lhs is not a number', {})
            if (!isNumberType(value)) throw new ExecutionError('Subtraction: rhs is not a number', {})
            return 'number'
          }

          if (tokenMatcher(operator, tokens.BitwiseAnd)) {
            if (!isNumberType(value) && !isStringType(value))
              throw new ExecutionError('BitwiseAnd: rhs is not a number or string', {})
            return 'number'
          }

          if (tokenMatcher(operator, tokens.BitwiseOr)) {
            if (!isNumberType(value) && !isStringType(value))
              throw new ExecutionError('BitwiseOr: rhs is not a number or string', {})
            return 'number'
          }

          throwUnknownOperatorError(operator, ctx)
          return prev
        }, left)
      }

      return ctx.rhs.reduce((prev: number, cur: CstNode | CstNode[], i: string | number) => {
        const operator = ctx.AdditionOperator[i]
        const value = this.visit(cur, state)

        if (tokenMatcher(operator, tokens.Addition)) return prev + value
        if (tokenMatcher(operator, tokens.Subtraction)) return prev - value
        if (tokenMatcher(operator, tokens.BitwiseAnd)) return prev & value
        if (tokenMatcher(operator, tokens.BitwiseOr)) return prev | value
        throwUnknownOperatorError(operator, ctx)
        return prev
      }, left || 0)
    }

    multiplicationExpression(ctx, state): any {
      const left = this.visit(ctx.lhs, state)
      if (!ctx.rhs) return left

      if (mode === 'check') {
        if (!isNumberType(left)) throw new ExecutionError('multiplicationExpression: lhs is not a number', {})

        return (ctx.rhs as any[]).reduce((prev: Big, cur: any, i: number) => {
          const operator = ctx.MultiplicationOperator[i]
          const value = this.visit(cur, state)

          if (!isNumberType(value)) throw new ExecutionError('multiplicationExpression: rhs is not a number', {})
          if (tokenMatcher(operator, tokens.Multiplication)) return 'number'
          if (tokenMatcher(operator, tokens.Division)) return 'number'
          throwUnknownOperatorError(operator, ctx)

          return prev
        }, left)
      }

      return (ctx.rhs as any[])
        .reduce(
          (prev: Big, cur: any, i: number) => {
            const operator = ctx.MultiplicationOperator[i]
            let value = this.visit(cur, state)

            if (!isNumeric(value)) value = 0
            if (tokenMatcher(operator, tokens.Multiplication)) return prev.times(value)
            if (tokenMatcher(operator, tokens.Division)) return prev.div(value)

            throwUnknownOperatorError(operator, ctx)

            return prev
          },
          Big(left || 0)
        )
        .toNumber()
    }

    atomicExpression(ctx, state): any {
      if (ctx.array) return this.visit(ctx.array, state)
      if (ctx.func) return this.visit(ctx.func, state)
      if (ctx.group) return this.visit(ctx.group, state)
      if (ctx.base) return this.visit(ctx.base, state)
      if (ctx.unaryExpression) return this.visit(ctx.unaryExpression, state)
      if (ctx.reference) return this.visit(ctx.reference, state)
    }

    unaryExpression(ctx, state) {
      const right = this.visit(ctx.atomicExpression, state)

      if (ctx.UnaryOperator) {
        const operator = ctx.UnaryOperator[0]
        if (tokenMatcher(operator, tokens.LogicalNot)) return !right
        if (tokenMatcher(operator, tokens.Addition)) return +right
        if (tokenMatcher(operator, tokens.Subtraction)) return -right
        if (tokenMatcher(operator, tokens.Increment)) return right + 1
        if (tokenMatcher(operator, tokens.Decrement)) return right - 1
        throwUnknownOperatorError(operator, ctx)
      }

      throw new ExecutionError(`一元表达式应该由一个操作符和一个操作数组成`, {
        context: ctx
      })
    }

    reference(ctx, state): any {
      const name = ctx.Reference[0].image.slice(1, -1)
      return getIn(state.variables, name)
    }

    arguments(ctx, state): any {
      if (!ctx.additionExpression) return []
      const result = ctx.additionExpression.map((arg) => this.visit(arg, state))
      return result
    }

    array(ctx, state): any {
      return (ctx.logicalExpression || []).map((m) => this.visit(m, state))
    }

    func(ctx, state): any {
      const funcName = ctx.Func[0].image
      const func = functions[funcName]

      if (!func) {
        throw new ExecutionError(`Unknown function: ${funcName} at ${ctx.Func[0].startOffset}`, {
          funcName,
          context: ctx
        })
      }

      const args = (ctx.args || []).map((m) => this.visit(m, state))
      // console.log('funcfuncfunc', args)
      try {
        return func.apply({}, args)
      } catch (err) {
        const loc = ctx.Func[0].startOffset
        const stack = (err as any).stack
        const msg = `Function ${funcName} at ${loc} thrown an error: ${err}, stacktrace: ${stack}`

        throw new FunctionError(msg, {
          originalError: err,
          funcName,
          function: ctx.Func[0],
          context: ctx
        })
      }
    }

    group(ctx, state): any {
      return this.visit(ctx.expression, state)
    }

    base(ctx): any {
      // console.log('base', ctx)
      if (mode === 'check') {
        if (ctx.StringLiteral) {
          // 分为单引号，双引号字符串
          const t = ctx.StringLiteral[0].image.slice(1, -1)
          return /^\$\{[a-z]+\}$/.test(t) ? t.match(/^\$\{([a-z]+)\}$/)[1] : 'string'
        }

        // if (ctx.DateLiteral) return new Date(ctx.DateLiteral[0].image);
        if (ctx.BooleanLiteral) return 'boolean'
        if (ctx.NumberLiteral) return 'number'
        if (ctx.NullLiteral) return 'null'
        if (ctx.UndefinedLiteral) return 'undefined'
        if (ctx.NaNLiteral) return 'number'

        return undefined
      }

      if (ctx.StringLiteral) {
        // 分为单引号，双引号字符串
        return ctx.StringLiteral[0].image.slice(1, -1)
        //.replace(/''/, "'");
        // return ctx.DateLiteral[0].image.slice(1, -1).replace(/""/, '"');
      }

      if (ctx.DateLiteral) return new Date(ctx.DateLiteral[0].image)
      if (ctx.BooleanLiteral) return ctx.BooleanLiteral[0].image === 'true' ? true : false
      if (ctx.NumberLiteral) return Number(ctx.NumberLiteral[0].image.replace(/,/g, ''))
      if (ctx.NullLiteral) return null
      if (ctx.UndefinedLiteral) return undefined
      if (ctx.NaNLiteral) return NaN

      return undefined
    }
  }

  return new InterpreterVisitor()
}
