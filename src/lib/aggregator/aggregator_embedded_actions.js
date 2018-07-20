'use strict';
const { Lexer, Parser} = require('chevrotain');
const { tokens, allTokens } = require('./tokens');


class Calculator extends Parser {
  constructor(input, period) {
    super(input, allTokens);
    this._period = period;
    const $ = this;

    $.RULE('expression', () => {
      return $.SUBRULE($.unaryExpression);
    });

    $.RULE('unaryExpression', () => {
      $.CONSUME(tokens.LastOperator);
      const key = $.CONSUME(tokens.StringLiteral).image;
      return this._period.last(key);
    });
    this.performSelfAnalysis();
  }
}

module.exports = period => text => {
  const CalculatorLexer = new Lexer(allTokens);
  const parser = new Calculator([], period);
  const lexResult = CalculatorLexer.tokenize(text);
  parser.input = lexResult.tokens;
  const value = parser.expression();

  return {
    value: value,
    lexResult: lexResult,
    parseErrors: parser.errors
  };
};
