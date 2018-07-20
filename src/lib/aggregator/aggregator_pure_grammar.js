'use strict';
const { Lexer, Parser } = require('chevrotain');

const { allTokens, tokens } = require('./tokens');
class CalculatorPure extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true });

    const $ = this;

    $.RULE('expression', () => {
      $.SUBRULE($.unaryExpression);
    });

    $.RULE('unaryExpression', () => {
      $.CONSUME(tokens.LastOperator);
      $.SUBRULE($.stringExpression, { LABEL: 'field'});
    });

    $.RULE('stringExpression', () => {
      $.CONSUME(tokens.StringLiteral);
    });
    this.performSelfAnalysis();
  }
}

const parser = new CalculatorPure([]);

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

class CalculatorInterpreter extends BaseCstVisitor {
  constructor(period) {
    super();
    this._period = period;
    this.validateVisitor();
  }

  expression(ctx) {
    return this.visit(ctx.unaryExpression);
  }

  stringExpression(ctx) {
    return ctx.StringLiteral[0].image;
  }

  unaryExpression(ctx) {
    const result = this.visit(ctx.field);
    return this._period.last(result);
  }


}

// We only need a single interpreter instance because our interpreter has no state.

module.exports = (period) => (text) => {
  const CalculatorLexer = new Lexer(allTokens);
  const interpreter = new CalculatorInterpreter(period);
  // 1. Tokenize the input.
  const lexResult = CalculatorLexer.tokenize(text);

  // 2. Parse the Tokens vector.
  parser.input = lexResult.tokens;
  const cst = parser.expression();

  // 3. Perform semantics using a CstVisitor.
  // Note that separation of concerns between the syntactic analysis (parsing) and the semantics.
  const value = interpreter.visit(cst);

  return {
    value: value,
    lexResult: lexResult,
    parseErrors: parser.errors
  };
};
