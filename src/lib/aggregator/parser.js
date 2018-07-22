const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator,
  AverageOperator,
  PlusOperator,
  StringLiteral
} = tokens;

class AggregatorParser extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true });

    const $ = this;

    $.RULE('expression', () => {
      $.OR([
        { ALT: () =>       $.SUBRULE($.binaryExpression, { LABEL: 'operationExpression' })},
        { ALT: () => $.SUBRULE($.unaryExpression, { LABEL: 'operationExpression' })}
      ]);
    });

    $.RULE('unaryExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.averageOperation, { LABEL: 'operation' }) }
      ]);
    });

    $.RULE('binaryExpression', () => {
      $.SUBRULE($.additionExpression, { LABEL: 'operation' });
    });

    $.RULE('lastOperation', () => {
      $.CONSUME(LastOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('sumOperation', () => {
      $.CONSUME(SumOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('averageOperation', () => {
      $.CONSUME(AverageOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('additionExpression', () => {
      $.SUBRULE($.unaryExpression, { LABEL: 'rhs' });
      $.CONSUME(PlusOperator);
      $.SUBRULE2($.unaryExpression, { LABEL: 'lhs' });
    });

    $.RULE('stringExpression', () => {
      $.CONSUME(StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
