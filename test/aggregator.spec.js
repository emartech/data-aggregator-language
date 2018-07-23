const { expect } = require('chai');
const Period = require('../src/lib/period/period');

describe('The Aggregator Grammar', () => {
  const period = Period.create([
    {date: '2017-08-15', campaigns: { email: { open: 3 }}},
    {date: '2017-08-16', campaigns: { email: { open: 4 }}}
  ]);

  const aggregate = require('../src/aggregator')(period);

  it('has a last operator', () => {
    expect(aggregate('LAST campaigns.email.open').value).to.eql(4);
  });

  it('has a sum operator', () => {
    expect(aggregate('SUM campaigns.email.open').value).to.eql(7);
  });

  it('has an average operator', () => {
    expect(aggregate('AVERAGE campaigns.email.open').value).to.eql(3.5);
  });

  it('has an addition operator', () => {
    expect(aggregate('SUM campaigns.email.open + LAST campaigns.email.open').value).to.eql((3 + 4) + 4);
  });

  it('has an addition operator that works with number literals', () => {
    expect(aggregate('SUM campaigns.email.open + 1').value).to.eql((3 + 4) + 1);
  });

  it('passes through a number literal', () => {
    expect(aggregate('1').value).to.eql(1);
  });

  it('has a minus operator', () => {
    expect(aggregate('SUM campaigns.email.open - LAST campaigns.email.open').value).to.eql(3 + 4 - 4);
  });

  it('can chain addition operators', () => {
    expect(aggregate('1 + 1 + 1').value).to.eql(3);
  });

  it('can chain binary and unary operators', () => {
    expect(aggregate('LAST campaigns.email.open + 1 - LAST campaigns.email.open').value).to.eql(1);
  });

  it('can chain minus, plus operators', () => {
    expect(aggregate('1 - 1 + 1 - 1').value).to.eql(0);
  });

  it('has a multiplication operator', () => {
    expect(aggregate('2 * 3').value).to.eql(6);
  });

  it('applies the right precedence to the multiplication operator', () => {
    expect(aggregate('2 + 3 * 3').value).to.eql(11);
  });

  it('chains multiplication operators correctly', () => {
    expect(aggregate('2 * 2 * 2 * 2').value).to.eql(2 ** 4);
  });

  describe('when there is a parsing error', function() {
    it('throws an exception', () => {
      expect(() => aggregate('INVALID_TOKEN')).to.throw();
    })
  })
});
