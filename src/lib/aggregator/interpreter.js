module.exports = (parser) => {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

  class AggregatorInterpreter extends BaseCstVisitor {
    constructor(period) {
      super();
      this._period = period;
      this.validateVisitor();
    }

    expression(ctx) {
      return this.visit(ctx.additionExpression);
    }

    additionExpression(ctx) {
      const lhs = this.visit(ctx.lhs);
      let rhs = 0;
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand) => rhs += this.visit(rhsOperand));
      }
      return lhs + rhs;
    }

    minusExpression(ctx) {
      const lhs = this.visit(ctx.lhs);
      let rhs = 0;
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand) => rhs += this.visit(rhsOperand));
      }
      return lhs - rhs;
    }

    multiplicationExpression(ctx) {
      const lhs = this.visit(ctx.lhs);
      let rhs = 1;
      if (ctx.rhs) {
        ctx.rhs.forEach((rhsOperand) => rhs *= this.visit(rhsOperand));
      }
      return lhs * rhs;
    }

    numberExpression(ctx) {
      if (ctx.NumberLiteral !== undefined) {
        return parseInt(ctx.NumberLiteral[0].image);
      }
      return this.visit(ctx.operation);
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

    stringExpression(ctx) {
      return ctx.StringLiteral[0].image;
    }
  }

  return AggregatorInterpreter;
};
