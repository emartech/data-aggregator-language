'use strict';

const { Lexer } = require('chevrotain');

const AggregatorParser = require('./parser');
const { tokens } = require('./tokens');
const interpreterFactory = require('./interpreter');

const createAggregator = (lexer, parser, interpreter) => (text) => {
  parser.input = lexer.tokenize(text).tokens;
  const cst = parser.expression();
  const value = interpreter.visit(cst);

  assertParsingSuccessful(parser, text);

  return value;
};

let assertParsingSuccessful = function(parser, text) {
  if (parser.errors.length > 0) {
    throw new Error([`Error parsing "${text}"\n`] + parser.errors);
  }
};

const lexer = new Lexer(tokens);
const parser = new AggregatorParser();
const AggregatorInterpreter = interpreterFactory(parser);
const interpreter = new AggregatorInterpreter();

module.exports = (input) => {
  interpreter.period = input;
  return createAggregator(lexer, parser, interpreter);
};
