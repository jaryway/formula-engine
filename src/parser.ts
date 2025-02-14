import { CstParser } from "chevrotain";
import { tokens } from "./lexer";

export class FormulaParser extends CstParser {
  constructor() {
    super(tokens, { maxLookahead: 1 });
    this.performSelfAnalysis();
  }

  expression = this.RULE("expression", () => {
    this.SUBRULE(this.commaExpression);
  });

  commaExpression = this.RULE("commaExpression", () => {
    this.SUBRULE(this.logicalExpression);
    this.MANY(() => {
      this.CONSUME(tokens.Comma);
      this.SUBRULE2(this.logicalExpression);
    });
  });

  logicalExpression = this.RULE("logicalExpression", () => {
    this.SUBRULE(this.comparisonExpression, { LABEL: "lhs" });
    this.OPTION(() => {
      this.MANY(() => {
        // console.log('tokens.LogicalOperator',tokens.LogicalOperator);
        this.CONSUME(tokens.LogicalOperator);
        this.SUBRULE1(this.comparisonExpression, { LABEL: "rhs" });
      });
    });
  });

  comparisonExpression = this.RULE("comparisonExpression", () => {
    this.SUBRULE(this.additionExpression, { LABEL: "lhs" });
    this.OPTION(() => {
      this.MANY(() => {
        this.CONSUME(tokens.ComparisonOperator);
        this.SUBRULE1(this.additionExpression, { LABEL: "rhs" });
      });
    });
  });

  // comparisonExpression = this.RULE('comparisonExpression', () => {
  //   this.SUBRULE(this.additionExpression, { LABEL: 'lhs' });
  //   this.OPTION(() => {
  //     this.CONSUME(tokens.ComparisonOperator);
  //     this.SUBRULE1(this.func);
  //     this.SUBRULE1(this.additionExpression, { LABEL: 'rhs' });
  //   });
  // });

  additionExpression = this.RULE("additionExpression", () => {
    // + - & |
    this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(tokens.AdditionOperator);
      this.SUBRULE1(this.multiplicationExpression, { LABEL: "rhs" });
    });
  });

  multiplicationExpression = this.RULE("multiplicationExpression", () => {
    this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(tokens.MultiplicationOperator);
      this.SUBRULE1(this.atomicExpression, { LABEL: "rhs" });
    });
  });

  unaryExpression = this.RULE("unaryExpression", () => {
    this.CONSUME(tokens.UnaryOperator);
    this.SUBRULE(this.atomicExpression);
  });

  atomicExpression = this.RULE("atomicExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.SUBRULE(this.func) },
      { ALT: () => this.SUBRULE(this.group) },
      { ALT: () => this.SUBRULE(this.base) },
      { ALT: () => this.SUBRULE(this.reference) },
      { ALT: () => this.SUBRULE(this.unaryExpression) },
      // {
      //   ALT: () => {
      //     this.CONSUME(tokens.UnaryOperator);
      //     this.SUBRULE(this.atomicExpression);
      //   },
      // },
    ]);
    this.MANY(() => {
      this.CONSUME(tokens.LSquare);
      this.SUBRULE(this.expression);
      this.CONSUME(tokens.RSquare);
    });
  });

  reference = this.RULE("reference", () => {
    this.CONSUME(tokens.Reference);
  });

  array = this.RULE("array", () => {
    this.CONSUME(tokens.LSquare);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => {
        this.SUBRULE(this.logicalExpression);
      },
    });
    this.CONSUME(tokens.RSquare);
  });

  func = this.RULE("func", () => {
    this.CONSUME(tokens.Func);
    this.CONSUME(tokens.LParen);
    this.OPTION(() => {
      this.SUBRULE(this.logicalExpression, { LABEL: "args" });
      this.MANY(() => {
        this.CONSUME(tokens.Comma);
        this.SUBRULE2(this.logicalExpression, { LABEL: "args" });
      });
      this.OPTION2(() => {
        this.CONSUME2(tokens.Comma);
      });
    });
    this.CONSUME(tokens.RParen);
  });

  group = this.RULE("group", () => {
    this.CONSUME(tokens.LParen);
    this.AT_LEAST_ONE_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(tokens.RParen);
  });

  base = this.RULE("base", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.StringLiteral) },
      { ALT: () => this.CONSUME(tokens.DateLiteral) },
      { ALT: () => this.CONSUME(tokens.NumberLiteral) },
      { ALT: () => this.CONSUME(tokens.BooleanLiteral) },
      { ALT: () => this.CONSUME(tokens.UndefinedLiteral) },
      { ALT: () => this.CONSUME(tokens.NullLiteral) },
      { ALT: () => this.CONSUME(tokens.NaNLiteral) },
    ]);
  });
}
