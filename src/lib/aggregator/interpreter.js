module.exports = (parser) => {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

  class AggregatorInterpreter extends BaseCstVisitor {
    constructor(period) {
      super();
      this._period = period;
      this.validateVisitor();
    }

    expression(ctx) {
      return this.visit(ctx.unaryExpression);
    }

    unaryExpression(ctx) {
      return this.visit(ctx.operation)
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
