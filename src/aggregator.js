'use strict';

const { Lexer } = require('chevrotain');

const AggregatorParser = require('./lib/aggregator/parser');
const { allTokens } = require('./lib/aggregator/tokens');
const interpreterFactory = require('./lib/aggregator/interpreter');

module.exports = (period) => (text) => {
  const CalculatorLexer = new Lexer(allTokens);
  const parser = new AggregatorParser([]);

  const AggregatorInterpreter = interpreterFactory(parser);
  const interpreter = new AggregatorInterpreter(period);
  const lexResult = CalculatorLexer.tokenize(text);

  parser.input = lexResult.tokens;
  const cst = parser.additionExpression();

  const value = interpreter.visit(cst);

  if (parser.errors.length > 0) {
    throw new Error([`Error parsing "${text}"\n`] + parser.errors);
  }

  return value;
};
