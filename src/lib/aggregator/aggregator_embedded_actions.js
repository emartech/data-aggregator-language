'use strict';
const { createToken, Lexer, Parser, tokenMatcher } = require('chevrotain');

const UnaryOperator = createToken({
  name: 'UnaryOperator',
  pattern: Lexer.NA
});

const LastOperator = createToken({
  name: 'LastOperator',
  pattern: /LAST/,
  categories: UnaryOperator
});

const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA
});

const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  categories: AdditionOperator
});
const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  categories: AdditionOperator
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA
});
const Multi = createToken({
  name: 'Multi',
  pattern: /\*/,
  categories: MultiplicationOperator
});
const Div = createToken({
  name: 'Div',
  pattern: /\//,
  categories: MultiplicationOperator
});

const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[1-9]\d*/
});


const PowerFunc = createToken({ name: 'PowerFunc', pattern: /power/ });
const Comma = createToken({ name: 'Comma', pattern: /,/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /[\w\.]+/
});


const allTokens = [
  WhiteSpace,
  LastOperator,
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  NumberLiteral,
  AdditionOperator,
  UnaryOperator,
  MultiplicationOperator,
  PowerFunc,
  Comma,
  StringLiteral
];
const CalculatorLexer = new Lexer(allTokens);

class Calculator extends Parser {
  constructor(input, period) {
    super(input, allTokens);
    this._period = period;
    const $ = this;

    $.RULE('expression', () => {
      return $.SUBRULE($.unaryExpression);
    });

    $.RULE('unaryExpression', () => {
      $.CONSUME(LastOperator);
      const key = $.CONSUME(StringLiteral).image;
      return this._period.last(key);
    });
    this.performSelfAnalysis();
  }
}

module.exports = period => text => {
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
