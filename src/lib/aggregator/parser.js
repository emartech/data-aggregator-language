const { Parser } = require('chevrotain');
const { tokens, allTokens } = require('./tokens');

const {
  LastOperator,
  SumOperator,
  AverageOperator,
  PlusOperator,
  MinusOperator,
  MultiplicationOperator,
  DivisionOperator,
  OpeningParen,
  ClosingParen,
  StringLiteral,
  NumberLiteral
} = tokens;

class AggregatorParser extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true });

    const $ = this;

    $.RULE('expression', () => {
      $.SUBRULE($.additionExpression);
    });

    $.RULE('additionExpression', () => {
      $.SUBRULE($.minusExpression, { LABEL: 'lhs'});
      $.MANY(() => {
        $.CONSUME(PlusOperator);
        $.SUBRULE2($.minusExpression, { LABEL: 'rhs'});
      });
    });

    $.RULE('minusExpression', () => {
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(MinusOperator);
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('multiplicationExpression', () => {
      $.SUBRULE($.divisionExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(MultiplicationOperator);
        $.SUBRULE2($.divisionExpression, { LABEL: 'rhs'});
      });
    });

    $.RULE('divisionExpression', () => {
      $.SUBRULE($.numberExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(DivisionOperator);
        $.SUBRULE2($.numberExpression, { LABEL: 'rhs'});
      });
    });

    $.RULE('numberExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.averageOperation, { LABEL: 'operation' }) },
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
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

    $.RULE('parenthesisExpression', () => {
      $.CONSUME(OpeningParen);
      $.SUBRULE($.expression);
      $.CONSUME(ClosingParen);
    });

    $.RULE('stringExpression', () => {
      $.CONSUME(StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
