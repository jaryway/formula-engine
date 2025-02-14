// import { LexerError, ParserError } from './exceptions'
import { FormulaLexer } from './lexer'
import { FormulaParser } from './parser'
import { createEvalVisitor, IVisitor } from './visitor'
import * as formulas from './formula'
import * as formulaChecks from './formula-check'

export type FunctionsResolver = Record<string, Function>
export type ReferenceResolver = (names: string[]) => Record<string, any>
export type ReferenceResolverAsync = (names: string[]) => Promise<Record<string, any>>

type BaseValue = string | number | boolean
type Value = BaseValue | BaseValue[] | Record<string, BaseValue>

export class FormulaEngine {
  private parser: FormulaParser
  private evalVisitor: IVisitor
  mode = 'eval'
  // private refVisitor: IVisitor;

  constructor(
    // private resolveReferences: ReferenceResolver | ReferenceResolverAsync,
    // private functions: FunctionsResolver,
    mode: 'check' | 'eval' = 'eval'
  ) {
    this.mode = mode
    this.parser = new FormulaParser()
    const functions = mode === 'eval' ? formulas : formulaChecks
    this.evalVisitor = createEvalVisitor(this.parser, functions, mode)
    // this.refVisitor = createRefVisitor(this.parser);
  }

  exec(formula: string, variables?: Record<string, Value>) {
    const cst = this.getCst(formula)

    // const externalNames = [];
    // this.refVisitor.visit(cst, { externalNames });
    // const externals = this.resolveReferences(externalNames);

    const result = this.evalVisitor.visit(cst, { variables })
    return result
  }

  async execAsync(formula: string) {
    const cst = this.getCst(formula)

    // const externalNames = [];
    // this.refVisitor.visit(cst, { externalNames });
    // const externals = await (this.resolveReferences as ReferenceResolverAsync)(externalNames);

    const result = this.evalVisitor.visit(cst, {})
    return result
  }

  private getCst(formula: string) {
    const lexingResult = this.tokenize(formula)
    const cst = this.parse(lexingResult)
    return cst
  }

  private tokenize(formula: string) {
    const lexingResult = FormulaLexer.tokenize(formula)

    if (lexingResult.errors.length > 0 && this.mode === 'check') {
      const [err] = lexingResult.errors
      const match = err.message.match(/->(.)<-/)
      const token = (match && match[1]) || ''
      throw new Error(JSON.stringify({ type: 'lexer', name: err.message, token }))
    }
    return lexingResult
  }

  private parse(lexingResult) {
    this.parser.reset()
    this.parser.input = lexingResult.tokens
    const cst = this.parser.expression()

    if (!cst || (this.parser.errors.length > 0 && this.mode === 'check')) {
      const [err] = this.parser.errors
      const match = err.message.match(/->\s(\w+)\s<-/)
      const token = (match && match[1]) || (err.token ? err.token.image : undefined)
      throw new Error(JSON.stringify({ type: 'parser', name: err.message, token }))
    }
    return cst
  }
}
