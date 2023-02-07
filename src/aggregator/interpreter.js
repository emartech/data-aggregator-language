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

    expression(ctx) {
      return this.visit(ctx.expression);
    }

    arrayExpression(ctx) {
      return this.visit(ctx.expression);
    }

    unionExpression(ctx) {
      return this._period.union(this.visit(ctx.stringExpression));
    }

    notExpression(ctx) {
      return this._accumulateNot(ctx.notOperator, this.visit(ctx.emptyExpression));
    }

    emptyExpression(ctx) {
      return this._isEmpty(this.visit(ctx.arrayExpression));
    }

    additionExpression(ctx) {
      return this._coalesceNull(ctx, (ctx, lhs) => {
        return lhs + this._accumulateAdditiveRhs(ctx.rhs);
      });
    }

    minusExpression(ctx) {
      return this._coalesceNull(ctx, (ctx, lhs) => {
        return lhs - this._accumulateAdditiveRhs(ctx.rhs);
      });
    }

    multiplicationExpression(ctx) {
      return this._coalesceNull(ctx, (ctx, lhs) => {
        return lhs * this._accumulateMultiplicativeRhs(ctx.rhs);
      });
    }

    divisionExpression(ctx) {
      return this._coalesceNull(ctx, (ctx, lhs) => {
        return lhs / this._accumulateMultiplicativeRhs(ctx.rhs);
      });
    }

    binaryOperandExpression(ctx) {
      return this.visit(ctx.expression);
    }

    parenthesisExpression(ctx) {
      return this.visit(ctx.additionExpression);
    }

    averageExpression(ctx) {
      return this._period.average(this.visit(ctx.stringExpression)) || null;
    }

    sumExpression(ctx) {
      return this._period.sum(this.visit(ctx.stringExpression)) || null;
    }

    lastExpression(ctx) {
      return this._period.last(this.visit(ctx.stringExpression)) || null;
    }

    lengthExpression() {
      return this._period.length;
    }

    numberExpression(ctx) {
      if (ctx.minusOperator) {
        return parseFloat(ctx.numberLiteral[0].image) * -1;
      }
      return parseFloat(ctx.numberLiteral[0].image);
    }

    stringExpression(ctx) {
      return ctx.stringLiteral[0].image;
    }

    _coalesceNull(ctx, cb) {
      const lhs = this.visit(ctx.lhs);
      return lhs === null ? null : cb(ctx, lhs);
    }

    _accumulateAdditiveRhs(rhs) {
      return this._accumulateRhs(rhs, 0, (accumulator, current) => accumulator + this.visit(current));
    }

    _accumulateMultiplicativeRhs(rhs) {
      return this._accumulateRhs(rhs, 1, (accumulator, current) => accumulator * this.visit(current));
    }

    _accumulateNot(operators, bool) {
      if (operators) {
        return operators.reduce(accumulator => !accumulator, bool);
      }
      return bool;
    }

    _accumulateRhs(rhs, init, accumulateOperation) {
      if (rhs) {
        return rhs.reduce(accumulateOperation, init);
      }
      return init;
    }

    _isEmpty(array) {
      return array.length === 0;
    }
  }

  return AggregatorInterpreter;
};
