'use strict';

const { createToken, Lexer } = require('chevrotain');

const UnaryOperator = createToken({
  name: 'UnaryOperator',
  pattern: Lexer.NA
});

const BinaryOperator = createToken({
  name: 'BinaryOperator',
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

const AverageOperator = createToken({
  name: 'AverageOperator',
  pattern: /AVERAGE/,
  categories: UnaryOperator
});

const PlusOperator = createToken({
  name: 'PlusOperator',
  pattern: /\+/,
  categories: BinaryOperator
});

const MinusOperator = createToken({
  name: 'MinusOperator',
  pattern: /\-/,
  categories: BinaryOperator
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: /\*/,
  categories: BinaryOperator
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

const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /[1-9]\d*/
});

const allTokens = [
  WhiteSpace,
  LastOperator,
  SumOperator,
  AverageOperator,
  PlusOperator,
  MinusOperator,
  MultiplicationOperator,
  UnaryOperator,
  BinaryOperator,
  NumberLiteral,
  StringLiteral
];

const tokens = {
  WhiteSpace,
  LastOperator,
  SumOperator,
  AverageOperator,
  PlusOperator,
  MinusOperator,
  MultiplicationOperator,
  UnaryOperator,
  BinaryOperator,
  NumberLiteral,
  StringLiteral
};

module.exports = {
  allTokens,
  tokens
};
