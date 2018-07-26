'use strict';

const { createToken, Lexer } = require('chevrotain');

const lastOperator = createToken({
  name: 'lastOperator',
  pattern: /LAST/
});

const sumOperator = createToken({
  name: 'sumOperator',
  pattern: /SUM/
});

const averageOperator = createToken({
  name: 'averageOperator',
  pattern: /AVERAGE/
});

const lengthConstant = createToken({
  name: 'lengthConstant',
  pattern: /LENGTH/
});

const plusOperator = createToken({
  name: 'plusOperator',
  pattern: /\+/
});

const minusOperator = createToken({
  name: 'minusOperator',
  pattern: /\-/
});

const multiplicationOperator = createToken({
  name: 'multiplicationOperator',
  pattern: /\*/
});

const divisionOperator = createToken({
  name: 'divisionOperator',
  pattern: /\//
});

const openingParen = createToken({
  name: 'openingParen',
  pattern: '\('
});

const closingParen = createToken({
  name: 'closingParen',
  pattern: '\)'
});

const whiteSpace = createToken({
  name: 'whiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const stringLiteral = createToken({
  name: 'stringLiteral',
  pattern: /[\w\.\[\]_]+/
});

const numberLiteral = createToken({
  name: 'numberLiteral',
  pattern: /[1-9]\d*/
});

const tokens = [
  whiteSpace,
  lastOperator,
  sumOperator,
  averageOperator,
  lengthConstant,
  plusOperator,
  minusOperator,
  multiplicationOperator,
  divisionOperator,
  openingParen,
  closingParen,
  numberLiteral,
  stringLiteral
];

module.exports = { tokens };
