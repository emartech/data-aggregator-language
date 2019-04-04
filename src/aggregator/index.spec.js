'use strict';

const subject = require('./index');

describe('The Aggregator Grammar', () => {
  let aggregate;

  before(() => {
    aggregate = subject([
      {
        date: '2017-08-15',
        campaigns: { email: { open: 3 }, values_for_test: [4, 10, 2] },
        programs: { ids: ['1', '2'], users: [] }
      },
      {
        date: '2017-08-16',
        campaigns: { email: { open: 4 }, values_for_test: [2, 9] },
        programs: { ids: ['2', '3', '4'], users: [] }
      }
    ]);
  });

  describe('Number Expressions', () => {
    describe('Binary Operands', () => {
      it('has a last operator', () => {
        expect(aggregate('LAST campaigns.email.open')).to.eql(4);
      });

      it('has a sum operator', () => {
        expect(aggregate('SUM campaigns.email.open')).to.eql(7);
      });

      it('has an average operator', () => {
        expect(aggregate('AVERAGE campaigns.email.open')).to.eql(3.5);
      });

      it('has a LENGTH constant', () => {
        expect(aggregate('LENGTH')).to.eql(2);
      });

      it('has a rule for number literals', () => {
        expect(aggregate('1')).to.eql(1);
      });

      it('works for floating point numbers', () => {
        expect(aggregate('0.5')).to.eql(0.5);
      });
    });

    describe('Binary Operators', () => {
      describe('Plus Operator', () => {
        it('exists', () => {
          expect(aggregate('SUM campaigns.email.open + LAST campaigns.email.open')).to.eql((3 + 4) + 4);
        });

        it('can take any binary operand', () => {
          expect(aggregate('SUM campaigns.email.open + 1')).to.eql((3 + 4) + 1);
        });

        it('chains', () => {
          expect(aggregate('1 + 1 + 1')).to.eql(3);
        });
      });

      describe('Minus Operator', () => {
        it('exists', () => {
          expect(aggregate('SUM campaigns.email.open - LAST campaigns.email.open')).to.eql(3 + 4 - 4);
        });


        it('can take any binary operand', () => {
          expect(aggregate('LAST campaigns.email.open + 1 - LAST campaigns.email.open')).to.eql(1);
        });

        it('chains', () => {
          expect(aggregate('1 - 1 + 1 - 1')).to.eql(0);
        });
      });

      describe('Multiplication Operator', () => {
        it('exists', () => {
          expect(aggregate('2 * 3')).to.eql(6);
        });

        it('chains', () => {
          expect(aggregate('2 * 2 * 2 * 2')).to.eql(16);
        });

        it('has a higher precedence than the plus operator', () => {
          expect(aggregate('2 + 3 * 3')).to.eql(11);
        });

        it('has a higher precedence than the minus operator', () => {
          expect(aggregate('10 - 3 * 2')).to.eql(4);
        });
      });

      describe('Division Operator', () => {
        it('exists', () => {
          expect(aggregate('2 / 2')).to.eql(1);
        });

        it('chains', () => {
          expect(aggregate('20 / 2 / 5')).to.eql(2);
        });

        it('doesnt matter how its precedence relates to the multiplication operator', () => {
          expect(aggregate('5 * 6 / 3')).to.eql(10);
        });

        it('has a higher precedence than the plus operator', () => {
          expect(aggregate('2 + 3 / 3')).to.eql(3);
        });

        it('has a higher precedence than the minus operator', () => {
          expect(aggregate('9 - 3 / 3')).to.eql(8);
        });

        it('yields accurate floating point results for all-number expressions', () => {
          expect(aggregate('5 / 2')).to.eql(2.5);
        });

        it('yields accurate floating point results when an operand is an aggregation expression', () => {
          expect(aggregate('LAST campaigns.email.open / 8')).to.eql(0.5);
        });
      });
    });

    describe('parentheses', () => {
      it('overwrites operator precedence', () => {
        expect(aggregate('(10 + 5) * 3')).to.eql(45);
      });

      it('can be placed around any number expression', () => {
        expect(aggregate('(((123)))')).to.eql(123);
      });
    });
  });

  describe('string literal', () => {
    it('can contain []\'s, _\'s', () => {
      expect(aggregate('LAST campaigns.values_for_test[1]')).to.eql(9);
    });
  });

  describe('Array Expressions', () => {
    describe('Union Operator', () => {
      it('exists', () => {
        expect(aggregate('UNION programs.ids')).to.deep.eql(['1', '2', '3', '4']);
      });
    });
  });

  describe('Logical Expressions', () => {
    describe('Empty Operator', () => {
      it('works for non-empty arrays', () => {
        expect(aggregate('EMPTY UNION programs.ids')).to.eql(false);
      });

      it('works for empty array', () => {
        expect(aggregate('EMPTY UNION programs.users')).to.eql(true);
      });

      it('works for properties that are not defined', function() {
        expect(aggregate('EMPTY UNION programs.foo')).to.eql(true);
      });
    });

    describe('Not Operator', function() {
      it('works', function() {
        expect(aggregate('NOT EMPTY UNION programs.users')).to.eql(false);
      });

      it('works four double negatives', function() {
        expect(aggregate('NOT NOT EMPTY UNION programs.users')).to.eql(true);
      });
    });
  });

  describe('when there is a parsing error', () => {
    it('throws an exception', () => {
      expect(() => aggregate('INVALID_TOKEN')).to.throw('Error parsing "INVALID_TOKEN"');
    });

    it('throws an exception when there are mismatched parentheses', () => {
      expect(() => aggregate('(1 + 2)(')).to.throw('Error parsing "(1 + 2)("');
    });

    it('does not allow parens between unary operator and operand', () => {
      expect(() => aggregate('LAST(campaigns)')).to.throw('Error parsing "LAST(campaigns)"');
    });

    it('throws an exception when a unary operation has no argument', () => {
      expect(() => aggregate('LAST + 2')).to.throw('Error parsing "LAST + 2"');
    });
  });

  context('partially has data', function() {
    it('works', function() {
      const periodDataWithMissingValues = [{ date: '2018-03-10', value: 1 }];

      aggregate = subject(periodDataWithMissingValues);

      expect(aggregate('LAST value + LAST otherVal')).to.eql(1);
      expect(aggregate('SUM value + SUM otherVal')).to.eql(1);
      expect(aggregate('AVERAGE value + AVERAGE otherVal')).to.eql(1);
      expect(aggregate('SUM otherVal')).to.eql(0);
      expect(aggregate('LAST otherVal')).to.eql(0);
      expect(aggregate('AVERAGE otherVal')).to.eql(0);
    });
  });
});
