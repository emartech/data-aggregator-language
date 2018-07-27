'use strict';

const { Lexer } = require('chevrotain');

const AggregatorParser = require('./parser');
const { tokens } = require('./tokens');
const interpreterFactory = require('./interpreter');
const Period = require('../lib/period/period');


const createAggregator = (lexer, parser, interpreter) => (text) => {
  const lexResult = lexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.additionExpression();
  const value = interpreter.visit(cst);

  assertParsingSuccessful(parser, text);

  return value;
};

let assertParsingSuccessful = function(parser, text) {
  if (parser.errors.length > 0) {
    throw new Error([`Error parsing "${text}"\n`] + parser.errors);
  }
};

(() => {
  const lexer = new Lexer(tokens);
  const parser = new AggregatorParser([]);
  const AggregatorInterpreter = interpreterFactory(parser);

  module.exports = (input) => {
    const interpreter = new AggregatorInterpreter(Period.create(input));
    return createAggregator(lexer, parser, interpreter);
  };
})();
