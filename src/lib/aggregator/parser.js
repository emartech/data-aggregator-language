const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator,
  AverageOperator,
  StringLiteral
} = tokens;

class AggregatorParser extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true });

    const $ = this;

    $.RULE('expression', () => {
      $.SUBRULE($.unaryExpression);
    });

    $.RULE('unaryExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.averageOperation, { LABEL: 'operation' }) }
      ]);
    });

    $.RULE('lastOperation', () => {
      $.CONSUME(LastOperator);
      $.CONSUME(StringLiteral);
    });

    $.RULE('sumOperation', () => {
      $.CONSUME(SumOperator);
      $.CONSUME(StringLiteral);
    });

    $.RULE('averageOperation', () => {
      $.CONSUME(AverageOperator);
      $.CONSUME(StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
