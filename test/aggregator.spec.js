const { expect } = require('chai');
const Period = require('../src/lib/period/period');

describe('The Calculator Grammar', () => {
  const period = Period.create([
    {date: '2017-08-15', campaigns: { email: { open: 3 }}},
    {date: '2017-08-16', campaigns: { email: { open: 4 }}}
  ]);

  const aggregate = require('../src/aggregator')(period);

  it('works with last', () => {
    expect(aggregate('LAST campaigns.email.open').value).to.eql(4);
  });

  it('works with sum', () => {
    expect(aggregate('SUM campaigns.email.open').value).to.eql(7);
  });

  describe('when there is a parsing error', function() {
    it('throws an exception', () => {
      expect(() => aggregate('INVALID_TOKEN')).to.throw();
    })
  })
});
