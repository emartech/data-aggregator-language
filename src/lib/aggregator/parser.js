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
      $.SUBRULE($.binaryOperandExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(DivisionOperator);
        $.SUBRULE2($.binaryOperandExpression, { LABEL: 'rhs'});
      });
    });

    $.RULE('binaryOperandExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastOperation, { LABEL: 'unaryOperation' }) },
        { ALT: () => $.SUBRULE($.sumOperation, { LABEL: 'unaryOperation' }) },
        { ALT: () => $.SUBRULE($.averageOperation, { LABEL: 'unaryOperation' }) },
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
      $.SUBRULE($.additionExpression);
      $.CONSUME(ClosingParen);
    });

    $.RULE('stringExpression', () => {
      $.CONSUME(StringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
