/*
基本概念
运算符：
比较运算符 (Comparison operators) 等于、不等于、全等于、不全等于、大于、大于等于、小于、小于等于
算数运算符 (Arithmetic operators) 加、减、乘、除
位运算符 (Bitwise operators) 与、或
逻辑运算符 (Logical operators) 与、或
逗号运算符 (Comma operator)
一元运算符 (Unary operators) 自增(++i,i--)、自减(--i,i--)、一元负值、一元正值、非(!、!!)

操作数-字面量：
字符串
日期
布尔值
数字
空
未定义
NaN

运算符优先级
1 + !2 * 3 / 4 & 5 !== 6 && 1 * 2 + 3
() > 一元运算符 > 乘除 > 加减、位运算 > 比较运算符 > 逻辑运算符
 */

import { createToken, Lexer, TokenType } from "chevrotain";

enum TokenName {
  LParen = "LParen",
  RParen = "RParen",
  LSquare = "LSquare",
  RSquare = "RSquare",
  WhiteSpace = "WhiteSpace",
  Comma = "Comma",
  Func = "Func",

  StringLiteral = "StringLiteral",
  DateLiteral = "DateLiteral",
  BooleanLiteral = "BooleanLiteral",
  NumberLiteral = "NumberLiteral",
  NullLiteral = "NullLiteral",
  UndefinedLiteral = "UndefinedLiteral",
  NaNLiteral = "NaNLiteral",
  Reference = "Reference",

  AdditionOperator = "AdditionOperator",
  Addition = "Addition",
  Subtraction = "Subtraction",
  MultiplicationOperator = "MultiplicationOperator",
  Multiplication = "Multiplication",
  Division = "Division",

  // 等于、不等于、全等于、不全等于、大于、大于等于、小于、小于等于
  ComparisonOperator = "ComparisonOperator",
  EqualLoose = "EqualLoose",
  NotEqualLoose = "NotEqualLoose",
  EqualStrict = "EqualStrict",
  NotEqualStrict = "NotEqualStrict",
  Greater = "Greater",
  GreaterOrEqual = "GreaterOrEqual",
  Less = "Less",
  LessOrEqual = "LessOrEqual",

  BitwiseOperator = "BitwiseOperator",
  BitwiseAnd = "BitwiseAnd",
  BitwiseOr = "BitwiseOr",

  LogicalOperator = "LogicalOperator",
  LogicalAnd = "LogicalAnd",
  LogicalOr = "LogicalOr",

  UnaryOperator = "UnaryOperator",
  Increment = "Increment",
  Decrement = "Decrement",
  LogicalNot = "LogicalNot",
  // Positive = 'Positive', // 正值
  // Negative = 'Negative', // 负值
}

const AdditionOperator = createToken({
  name: TokenName.AdditionOperator,
  pattern: Lexer.NA,
});
const MultiplicationOperator = createToken({
  name: TokenName.MultiplicationOperator,
  pattern: Lexer.NA,
});
const ComparisonOperator = createToken({
  name: TokenName.ComparisonOperator,
  pattern: Lexer.NA,
});
const BitwiseOperator = createToken({
  name: TokenName.BitwiseOperator,
  pattern: Lexer.NA,
});
const LogicalOperator = createToken({
  name: TokenName.LogicalOperator,
  pattern: Lexer.NA,
});
const UnaryOperator = createToken({
  name: TokenName.UnaryOperator,
  pattern: Lexer.NA,
});

const LParen = createToken({ name: TokenName.LParen, pattern: /\(/ });
const RParen = createToken({ name: TokenName.RParen, pattern: /\)/ });
const LSquare = createToken({ name: TokenName.LSquare, pattern: /\[/ });
const RSquare = createToken({ name: TokenName.RSquare, pattern: /\]/ });
const WhiteSpace = createToken({
  name: TokenName.WhiteSpace,
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});
const Comma = createToken({ name: TokenName.Comma, pattern: /,/ });
const Func = createToken({ name: TokenName.Func, pattern: /[A-Z0-9_]+/ });

const StringLiteral = createToken({
  name: TokenName.StringLiteral,
  pattern: /("(\\\\|\\"|[^"])*"|'(\\\\|\\'|[^'])*')/,
});
const DateLiteral = createToken({
  name: TokenName.DateLiteral,
  pattern: /[\d-+]+T[\d:.]+Z/,
});
const NumberLiteral = createToken({
  name: TokenName.NumberLiteral,
  pattern: /[0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?/,
});
const BooleanLiteral = createToken({
  name: TokenName.BooleanLiteral,
  pattern: /(true|false)/,
});
const NullLiteral = createToken({
  name: TokenName.NullLiteral,
  pattern: /null/,
});
const UndefinedLiteral = createToken({
  name: TokenName.UndefinedLiteral,
  pattern: /undefined/,
});
const NaNLiteral = createToken({ name: TokenName.NaNLiteral, pattern: /NaN/ });
const Reference = createToken({
  name: TokenName.Reference,
  pattern: /\{[A-Za-z_0-9.]+\}/,
});

const Addition = createToken({
  name: TokenName.Addition,
  pattern: /\+/,
  categories: [AdditionOperator, UnaryOperator],
});
const Subtraction = createToken({
  name: TokenName.Subtraction,
  pattern: /-/,
  categories: [AdditionOperator, UnaryOperator],
});

const Multiplication = createToken({
  name: TokenName.Multiplication,
  pattern: /\*/,
  categories: MultiplicationOperator,
});
const Division = createToken({
  name: TokenName.Division,
  pattern: /\//,
  categories: MultiplicationOperator,
});

const EqualLoose = createToken({
  name: TokenName.EqualLoose,
  pattern: /==/,
  categories: [ComparisonOperator],
});
const NotEqualLoose = createToken({
  name: TokenName.NotEqualLoose,
  pattern: /!=/,
  categories: [ComparisonOperator],
});
const EqualStrict = createToken({
  name: TokenName.EqualStrict,
  pattern: /===/,
  categories: [ComparisonOperator],
});
const NotEqualStrict = createToken({
  name: TokenName.NotEqualStrict,
  pattern: /!==/,
  categories: [ComparisonOperator],
});

const Greater = createToken({
  name: TokenName.Greater,
  pattern: />/,
  categories: [ComparisonOperator],
});
const GreaterOrEqual = createToken({
  name: TokenName.GreaterOrEqual,
  pattern: />=/,
  categories: [ComparisonOperator],
});

const Less = createToken({
  name: TokenName.Less,
  pattern: /</,
  categories: [ComparisonOperator],
});
const LessOrEqual = createToken({
  name: TokenName.LessOrEqual,
  pattern: /<=/,
  categories: [ComparisonOperator],
});

const BitwiseAnd = createToken({
  name: TokenName.BitwiseAnd,
  pattern: /&/,
  categories: [BitwiseOperator, ComparisonOperator],
});
const BitwiseOr = createToken({
  name: TokenName.BitwiseOr,
  pattern: /\|/,
  categories: [BitwiseOperator, ComparisonOperator],
});

const LogicalAnd = createToken({
  name: TokenName.LogicalAnd,
  pattern: /&&/,
  categories: [LogicalOperator],
});
const LogicalOr = createToken({
  name: TokenName.LogicalOr,
  pattern: /\|\|/,
  categories: [LogicalOperator],
});

const Increment = createToken({
  name: TokenName.Increment,
  pattern: /\+\+/,
  categories: [UnaryOperator],
});
const Decrement = createToken({
  name: TokenName.Decrement,
  pattern: /--/,
  categories: [UnaryOperator],
});
const LogicalNot = createToken({
  name: TokenName.LogicalNot,
  pattern: /!/,
  categories: [UnaryOperator],
});

const allTokens = [
  WhiteSpace,

  Increment,
  Decrement,

  Addition,
  Subtraction,
  Multiplication,
  Division,

  EqualStrict,
  NotEqualStrict,
  EqualLoose,
  NotEqualLoose,
  GreaterOrEqual,
  Greater,
  LessOrEqual,
  Less,

  LParen,
  RParen,
  LSquare,
  RSquare,

  DateLiteral,
  StringLiteral,
  BooleanLiteral,
  NumberLiteral,
  UndefinedLiteral,
  NullLiteral,
  NaNLiteral,

  ComparisonOperator,
  AdditionOperator,
  MultiplicationOperator,
  UnaryOperator,
  LogicalOperator,

  LogicalAnd,
  LogicalOr,

  BitwiseAnd,
  BitwiseOr,

  LogicalNot,

  Func,
  Reference,
  Comma,
];

export const FormulaLexer = new Lexer(allTokens, { ensureOptimizations: true });

export type TokenTypeDict = { [key in TokenName]: TokenType };
export const tokens: TokenTypeDict = allTokens.reduce((acc, tokenType) => {
  acc[tokenType.name] = tokenType;
  return acc;
}, {} as TokenTypeDict);

// console.log('tokens', allTokens, tokens);
