'use strict';

/* eslint new-cap: 0 */

const { Parser } = require('chevrotain');
const { tokens } = require('./tokens');

const [
  /* eslint-disable-next-line no-unused-vars */
  _,
  lastOperator,
  sumOperator,
  averageOperator,
  notOperator,
  emptyOperator,
  unionOperator,
  lengthConstant,
  plusOperator,
  minusOperator,
  multiplicationOperator,
  divisionOperator,
  openingParen,
  closingParen,
  numberLiteral,
  stringLiteral
] = tokens;

class AggregatorParser extends Parser {
  constructor() {
    super(tokens, { outputCst: true });

    /* eslint-disable-next-line consistent-this */
    const $ = this;

    $.RULE('expression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.arrayExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.notExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.additionExpression, { LABEL: 'expression' }) }
      ]);
    });

    $.RULE('arrayExpression', () => {
      $.SUBRULE($.unionExpression, { LABEL: 'expression' });
    });

    $.RULE('unionExpression', () => {
      $.CONSUME(unionOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('notExpression', () => {
      $.MANY(() => {
        $.CONSUME(notOperator);
      });
      $.SUBRULE($.emptyExpression);
    });

    $.RULE('emptyExpression', () => {
      $.CONSUME(emptyOperator);
      $.SUBRULE($.arrayExpression);
    });

    $.RULE('additionExpression', () => {
      $.SUBRULE($.minusExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(plusOperator);
        $.SUBRULE2($.minusExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('minusExpression', () => {
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(minusOperator);
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('multiplicationExpression', () => {
      $.SUBRULE($.divisionExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(multiplicationOperator);
        $.SUBRULE2($.divisionExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('divisionExpression', () => {
      $.SUBRULE($.binaryOperandExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(divisionOperator);
        $.SUBRULE2($.binaryOperandExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('binaryOperandExpression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.lastExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.sumExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.averageExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.lengthExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.parenthesisExpression, { LABEL: 'expression' }) },
        { ALT: () => $.SUBRULE($.numberExpression, { LABEL: 'expression' }) }
      ]);
    });

    $.RULE('lastExpression', () => {
      $.CONSUME(lastOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('sumExpression', () => {
      $.CONSUME(sumOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('averageExpression', () => {
      $.CONSUME(averageOperator);
      $.SUBRULE($.stringExpression);
    });

    $.RULE('lengthExpression', () => {
      $.CONSUME(lengthConstant);
    });

    $.RULE('parenthesisExpression', () => {
      $.CONSUME(openingParen);
      $.SUBRULE($.additionExpression);
      $.CONSUME(closingParen);
    });

    $.RULE('numberExpression', () => {
      $.OPTION(() => {
        $.OR([
          { ALT: () => $.CONSUME(minusOperator) },
          { ALT: () => $.CONSUME(plusOperator) }]);
      });
      $.CONSUME(numberLiteral);
    });

    $.RULE('stringExpression', () => {
      $.CONSUME(stringLiteral);
    });

    this.performSelfAnalysis();
  }
}

module.exports = AggregatorParser;
