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

    stringExpression(ctx) {
      return ctx.StringLiteral[0].image;
    }

    unaryExpression(ctx) {
      const result = this.visit(ctx.field);
      return this._period.last(result);
    }
  }

  return AggregatorInterpreter;
};
