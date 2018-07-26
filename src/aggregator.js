'use strict';

const { Lexer } = require('chevrotain');

const AggregatorParser = require('./lib/aggregator/parser');
const { tokens } = require('./lib/aggregator/tokens');
const interpreterFactory = require('./lib/aggregator/interpreter');
const Period = require('../src/lib/period/period');

const CalculatorLexer = new Lexer(tokens);
const parser = new AggregatorParser([]);
const AggregatorInterpreter = interpreterFactory(parser);

module.exports = (input) => (text) => {
  const interpreter = new AggregatorInterpreter(Period.create(input));
  const lexResult = CalculatorLexer.tokenize(text);

  parser.input = lexResult.tokens;
  const cst = parser.additionExpression();

  const value = interpreter.visit(cst);

  if (parser.errors.length > 0) {
    throw new Error([`Error parsing "${text}"\n`] + parser.errors);
  }

  return value;
};
