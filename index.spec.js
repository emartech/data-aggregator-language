const dataAggregatorLanguage = require('./');

describe('The Exported Module', () => {
  it('exports the aggregator', () => {
    const input = [{
      data: 1
    }];

    expect(dataAggregatorLanguage.aggregator(input)('LAST data')).to.eql(input[0].data);
  });

  it('exports the a list of token names', () => {
    expect(dataAggregatorLanguage.tokens).to.include('whiteSpace');
  })
});
