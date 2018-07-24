'use strict';

module.exports = (parser) => {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

  class AggregatorInterpreter extends BaseCstVisitor {
    constructor(period) {
      super();
      this._period = period;
      this.validateVisitor();
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

    averageOperation(ctx) {
      return this._period.average(this.visit(ctx.stringExpression));
    }

    sumOperation(ctx) {
      return this._period.sum(this.visit(ctx.stringExpression));
    }

    lastOperation(ctx) {
      return this._period.last(this.visit(ctx.stringExpression));
    }

    lengthConstant() {
      return this._period.length;
    }

    numberExpression(ctx) {
      return parseInt(ctx.NumberLiteral[0].image);
    }

    stringExpression(ctx) {
      return ctx.StringLiteral[0].image;
    }

    _accumulateAdditiveRhs(rhs) {
      return this._accumulateRhs(rhs, 0, (accumulator, current) => accumulator + this.visit(current));
    }

    _accumulateMultiplicativeRhs(rhs) {
      return this._accumulateRhs(rhs, 1, (accumulator, current) => accumulator * this.visit(current));
    }

    _accumulateRhs(rhs, init, accumulateOperation) {
      if (rhs) {
        return rhs.reduce(accumulateOperation, init)
      }
      return init;
    }
  }

  return AggregatorInterpreter;
};
