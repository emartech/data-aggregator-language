'use strict';

const Period = require('../lib/period/period');

module.exports = (parser) => {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

  class AggregatorInterpreter extends BaseCstVisitor {
    constructor() {
      super();
      this._period = null;
      this.validateVisitor();
    }

    set period(period) {
      this._period = Period.create(period);
    }

    additionExpression(ctx) {
      return this.visit(ctx.lhs) + this._accumulateAdditiveRhs(ctx.rhs);
    }

    minusExpression(ctx) {
      return this.visit(ctx.lhs) - this._accumulateAdditiveRhs(ctx.rhs);
    }

    multiplicationExpression(ctx) {
      return this.visit(ctx.lhs) * this._accumulateMultiplicativeRhs(ctx.rhs);
    }

    divisionExpression(ctx) {
      return this.visit(ctx.lhs) / this._accumulateMultiplicativeRhs(ctx.rhs);
    }

    binaryOperandExpression(ctx) {
      return this.visit(ctx.expression);
    }

    parenthesisExpression(ctx) {
      return this.visit(ctx.additionExpression);
    }

    averageExpression(ctx) {
      return this._period.average(this.visit(ctx.stringExpression));
    }

    sumExpression(ctx) {
      return this._period.sum(this.visit(ctx.stringExpression));
    }

    lastExpression(ctx) {
      return this._period.last(this.visit(ctx.stringExpression));
    }

    lengthExpression() {
      return this._period.length;
    }

    numberExpression(ctx) {
      return parseFloat(ctx.numberLiteral[0].image);
    }

    stringExpression(ctx) {
      return ctx.stringLiteral[0].image;
    }

    _accumulateAdditiveRhs(rhs) {
      return this._accumulateRhs(rhs, 0, (accumulator, current) => accumulator + this.visit(current));
    }

    _accumulateMultiplicativeRhs(rhs) {
      return this._accumulateRhs(rhs, 1, (accumulator, current) => accumulator * this.visit(current));
    }

    _accumulateRhs(rhs, init, accumulateOperation) {
      if (rhs) {
        return rhs.reduce(accumulateOperation, init);
      }
      return init;
    }
  }

  return AggregatorInterpreter;
};
