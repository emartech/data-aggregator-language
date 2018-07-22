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

  describe('when there is a parsing error', function() {
    it('throws an exception', () => {
      expect(() => aggregate('INVALID_TOKEN')).to.throw();
    })
  })
});
