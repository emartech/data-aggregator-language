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
      const operand = ctx.StringLiteral[0].image;
      return this._period.last(operand);
    }
  }

  return AggregatorInterpreter;
};
