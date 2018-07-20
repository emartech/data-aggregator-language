'use strict';

const { createToken, Lexer } = require('chevrotain');

const UnaryOperator = createToken({
  name: 'UnaryOperator',
  pattern: Lexer.NA
});

const LastOperator = createToken({
  name: 'LastOperator',
  pattern: /LAST/,
  categories: UnaryOperator
});

const SumOperator = createToken({
  name: 'SumOperator',
  pattern: /SUM/,
  categories: UnaryOperator
});

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
  SumOperator,
  UnaryOperator,
  StringLiteral
];

const tokens = {
  WhiteSpace,
  LastOperator,
  SumOperator,
  UnaryOperator,
  StringLiteral
};

module.exports = {
  allTokens,
  tokens
};
