/* eslint-disable eqeqeq */
import { CstNode, tokenMatcher } from 'chevrotain';
import { ExecutionError, FunctionError } from './exceptions';
import { tokens } from './lexer';
import { FormulaParser } from './parser';

export interface IVisitor {
  visit(cst: CstNode, state: any): any;
}

const throwUnknownOperatorError = (operator, ctx) => {
  throw new ExecutionError(`Unknown operator: ${operator.image} at ${operator.startOffset}`, {
    operator,
    context: ctx,
  });
};

export function createEvalVisitor(parser: FormulaParser, functions: any): IVisitor {
  const FormulaVisitorBase = parser.getBaseCstVisitorConstructorWithDefaults();

  class InterpreterVisitor extends FormulaVisitorBase {
    constructor() {
      super();
      this.validateVisitor();
    }

    expression(ctx, state): any {
      return this.visit(ctx.commaExpression, state);
    }

    commaExpression(ctx, state) {
      return this.visit(ctx.binaryExpression, state);
    }

    binaryExpression(ctx, state) {
      let left = this.visit(ctx.lhs, state);
      if (!ctx.rhs) return left;

      return ctx.rhs.reduce((prev: number, cur, i) => {
        const operator = ctx.LogicalOperator[i];
        const value = this.visit(cur, state);

        if (tokenMatcher(operator, tokens.LogicalAnd)) return prev && value;
        if (tokenMatcher(operator, tokens.LogicalOr)) return prev || value;

        return prev;
      }, left || 0);
    }

    comparisonExpression(ctx, state): any {
      // console.log('comparisonExpression', ctx);

      let left = this.visit(ctx.lhs, state);
      if (!ctx.rhs) return left;

      return ctx.rhs.reduce((prev: number, cur, i) => {
        const operator = ctx.ComparisonOperator[i];
        const value = this.visit(cur, state);

        if (tokenMatcher(operator, tokens.EqualLoose)) return prev == value;
        if (tokenMatcher(operator, tokens.NotEqualLoose)) return prev != value;
        if (tokenMatcher(operator, tokens.EqualStrict)) return prev === value;
        if (tokenMatcher(operator, tokens.NotEqualStrict)) return prev !== value;
        if (tokenMatcher(operator, tokens.Greater)) return prev > value;
        if (tokenMatcher(operator, tokens.GreaterOrEqual)) return prev >= value;
        if (tokenMatcher(operator, tokens.Less)) return prev < value;
        if (tokenMatcher(operator, tokens.LessOrEqual)) return prev <= value;
        if (tokenMatcher(operator, tokens.BitwiseAnd)) return prev & value;
        if (tokenMatcher(operator, tokens.BitwiseOr)) return prev | value;

        throwUnknownOperatorError(operator, ctx);

        return prev;
      }, left || 0);
    }

    additionExpression(ctx, state): any {
      let left = this.visit(ctx.lhs, state);
      if (!ctx.rhs) return left;

      return ctx.rhs.reduce((prev: number, cur: CstNode | CstNode[], i: string | number) => {
        const operator = ctx.AdditionOperator[i];
        const value = this.visit(cur, state);

        if (tokenMatcher(operator, tokens.Addition)) return prev + value;
        if (tokenMatcher(operator, tokens.Subtraction)) return prev - value;
        if (tokenMatcher(operator, tokens.BitwiseAnd)) return prev & value;
        if (tokenMatcher(operator, tokens.BitwiseOr)) return prev | value;
        console.log('additionExpression', operator);
        throwUnknownOperatorError(operator, ctx);
        return prev;
      }, left || 0);
    }

    multiplicationExpression(ctx, state): any {
      let left = this.visit(ctx.lhs, state);
      if (!ctx.rhs) return left;

      return ctx.rhs.reduce((prev: number, cur, i) => {
        const operator = ctx.MultiplicationOperator[i];
        const value = this.visit(cur, state);
        if (tokenMatcher(operator, tokens.Multiplication)) return prev * value;
        if (tokenMatcher(operator, tokens.Division)) return prev / value;
        throwUnknownOperatorError(operator, ctx);

        return prev;
      }, left || 0);
    }

    atomicExpression(ctx, state): any {
      if (ctx.array) return this.visit(ctx.array, state);
      if (ctx.func) return this.visit(ctx.func, state);
      if (ctx.group) return this.visit(ctx.group, state);
      if (ctx.base) return this.visit(ctx.base, state);
      if (ctx.unaryExpression) return this.visit(ctx.unaryExpression, state);
    }

    unaryExpression(ctx, state) {
      const right = this.visit(ctx.atomicExpression, state);

      if (ctx.UnaryOperator) {
        const operator = ctx.UnaryOperator[0];
        if (tokenMatcher(operator, tokens.LogicalNot)) return !right;
        if (tokenMatcher(operator, tokens.Addition)) return +right;
        if (tokenMatcher(operator, tokens.Subtraction)) return -right;
        if (tokenMatcher(operator, tokens.Increment)) return right + 1;
        if (tokenMatcher(operator, tokens.Decrement)) return right - 1;
        throwUnknownOperatorError(operator, ctx);
      }

      throw new ExecutionError(`一元表达式应该由一个操作符和一个操作数组成`, {
        context: ctx,
      });
    }

    funcExpression(ctx, state): any {
      const funcName = ctx.Func[0].image;
      const func = functions[funcName];

      if (!func) {
        throw new ExecutionError(`Unknown function: ${funcName} at ${ctx.Function[0].startOffset}`, {
          funcName,
          context: ctx,
        });
      }

      const args = this.visit(ctx.arguments[0], state);

      try {
        const result = func.apply({}, args);
        return result;
      } catch (err) {
        throw new FunctionError(
          `Function ${funcName} at ${ctx.Function[0].startOffset} thrown an error: ${err}, stacktrace: ${
            (err as any).stack
          }`,
          {
            originalError: err,
            funcName,
            function: ctx.Function[0],
            context: ctx,
          }
        );
      }
    }

    reference(ctx, state): any {
      const name = ctx.Reference[0].image.slice(1, -1);
      return state.externals[name];
    }

    parenthesisExpression(ctx, state): any {
      return this.visit(ctx.expression, state);
    }

    arguments(ctx, state): any {
      if (!ctx.additionExpression) return [];
      const result = ctx.additionExpression.map((arg) => this.visit(arg, state));
      return result;
    }

    array(ctx, state): any {
      return ctx.binaryExpression.map((m) => this.visit(m, state));
    }

    func(ctx, state): any {
      const funcName = ctx.Func[0].image;
      const func = functions[funcName];

      if (!func) {
        throw new ExecutionError(`Unknown function: ${funcName} at ${ctx.Func[0].startOffset}`, {
          funcName,
          context: ctx,
        });
      }
      

      const args = (ctx.args || []).map((m) => {
        console.log('args.m', m);
        return this.visit(m, state);
      });

      console.log('args.args', args);

      try {
        return func.apply({}, args);
      } catch (err) {
        const loc = ctx.Func[0].startOffset;
        const stack = (err as any).stack;
        const msg = `Function ${funcName} at ${loc} thrown an error: ${err}, stacktrace: ${stack}`;

        throw new FunctionError(msg, {
          originalError: err,
          funcName,
          function: ctx.Func[0],
          context: ctx,
        });
      }
    }

    group(ctx, state): any {
      return this.visit(ctx.expression, state);
    }

    base(ctx): any {
      if (ctx.StringLiteral) {
        // 分为单引号，双引号字符串
        return ctx.StringLiteral[0].image.slice(1, -1);
        //.replace(/''/, "'");
        // return ctx.DateLiteral[0].image.slice(1, -1).replace(/""/, '"');
      }

      if (ctx.DateLiteral) return new Date(ctx.DateLiteral[0].image);
      if (ctx.BooleanLiteral) return ctx.BooleanLiteral[0].image === 'true' ? true : false;
      if (ctx.NumberLiteral) return Number(ctx.NumberLiteral[0].image);
      if (ctx.NullLiteral) return null;
      if (ctx.UndefinedLiteral) return undefined;
      if (ctx.NaNLiteral) return NaN;

      return null;
    }
  }

  return new InterpreterVisitor();
}

export function createRefVisitor(parser: FormulaParser): IVisitor {
  const FormulaVisitorBase = parser.getBaseCstVisitorConstructorWithDefaults();

  class RefVisitor extends FormulaVisitorBase {
    constructor() {
      super();
      this.validateVisitor();
    }

    reference(ctx, state): any {
      const name = ctx.Reference[0].image.slice(1, -1);
      return state.externalNames.push(name);
    }
  }

  return new RefVisitor();
}
