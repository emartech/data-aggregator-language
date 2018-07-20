const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator,
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
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'operation' }) }
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

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
