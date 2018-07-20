const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator
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
        { ALT: () => $.CONSUME(LastOperator) },
        { ALT: () => $.CONSUME(SumOperator) }
      ]);

      $.CONSUME(tokens.StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
