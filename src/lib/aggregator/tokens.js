'use strict';

const { createToken, Lexer } = require('chevrotain');

const LastOperator = createToken({
  name: 'LastOperator',
  pattern: /LAST/
});

const SumOperator = createToken({
  name: 'SumOperator',
  pattern: /SUM/
});

const AverageOperator = createToken({
  name: 'AverageOperator',
  pattern: /AVERAGE/
});

const LengthConstant = createToken({
  name: 'LengthConstant',
  pattern: /LENGTH/
});

const PlusOperator = createToken({
  name: 'PlusOperator',
  pattern: /\+/
});

const MinusOperator = createToken({
  name: 'MinusOperator',
  pattern: /\-/
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: /\*/
});

const DivisionOperator = createToken({
  name: 'DivisionOperator',
  pattern: /\//
});

const OpeningParen = createToken({
  name: 'OpeningParen',
  pattern: '\('
});

const ClosingParen = createToken({
  name: 'ClosingParen',
  pattern: '\)'
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
  LengthConstant,
  PlusOperator,
  MinusOperator,
  MultiplicationOperator,
  DivisionOperator,
  OpeningParen,
  ClosingParen,
  NumberLiteral,
  StringLiteral
];

const tokens = {
  WhiteSpace,
  LastOperator,
  SumOperator,
  AverageOperator,
  LengthConstant,
  PlusOperator,
  MinusOperator,
  MultiplicationOperator,
  DivisionOperator,
  OpeningParen,
  ClosingParen,
  NumberLiteral,
  StringLiteral
};

module.exports = {
  allTokens,
  tokens
};
