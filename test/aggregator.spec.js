const { expect } = require('chai');
const Period = require('../src/lib/period/period');

describe('The Calculator Grammar', () => {
  const period = Period.create([
    {date: '2017-08-15', campaigns: { email: { open: 3 }}},
    {date: '2017-08-16', campaigns: { email: { open: 4 }}}
  ]);

  const calc = require('../src/lib/aggregator/aggregator_embedded_actions')(period);

  it('works with last', () => {
    let result = calc('LAST campaigns.email.open');
    expect(result.value).to.eql(4);
  })
});
