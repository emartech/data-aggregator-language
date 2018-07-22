module.exports = (parser) => {
  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

  class AggregatorInterpreter extends BaseCstVisitor {
    constructor(period) {
      super();
      this._period = period;
      this.validateVisitor();
    }

    expression(ctx) {
      return this.visit(ctx.operationExpression);
    }

    unaryExpression(ctx) {
      return this.visit(ctx.operation);
    }

    binaryExpression(ctx) {
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

    additionExpression(ctx) {
      const rhs = this.visit(ctx.rhs);
      const lhs = this.visit(ctx.lhs);
      return rhs + lhs;
    }

    minusExpression(ctx) {
      const rhs = this.visit(ctx.rhs);
      const lhs = this.visit(ctx.lhs);
      return rhs - lhs;
    }

    stringExpression(ctx) {
      return ctx.StringLiteral[0].image;
    }

    numberExpression(ctx) {
      return parseInt(ctx.NumberLiteral[0].image);
    }
  }

  return AggregatorInterpreter;
};
