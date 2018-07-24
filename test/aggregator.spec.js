'use strict';

const { expect } = require('chai');
const Period = require('../src/lib/period/period');

describe('The Aggregator Grammar', () => {
  const period = Period.create([
    { date: '2017-08-15', campaigns: { email: { open: 3 } } },
    { date: '2017-08-16', campaigns: { email: { open: 4 } } }
  ]);

  const aggregate = require('../src/aggregator')(period);

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
});
