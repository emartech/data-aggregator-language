const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator,
  AverageOperator,
  PlusOperator,
  MinusOperator,
  StringLiteral,
  NumberLiteral
} = tokens;

class AggregatorParser extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true });

    const $ = this;

    $.RULE('expression', () => {
      $.SUBRULE($.additionExpression)
    });

    $.RULE('additionExpression', () => {
      $.SUBRULE($.minusExpression, { LABEL: 'lhs'});
      $.MANY(() => {
        $.CONSUME(PlusOperator);
        $.SUBRULE2($.minusExpression, { LABEL: 'rhs'});
      });
    });

    $.RULE('minusExpression', () => {
      $.SUBRULE($.numberExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(MinusOperator);
        $.SUBRULE2($.numberExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('numberExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.averageOperation, { LABEL: 'operation' }) },
        { ALT: () => $.CONSUME(NumberLiteral) }
      ]);
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

    $.RULE('stringExpression', () => {
      $.CONSUME(StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
