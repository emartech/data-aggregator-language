const chevrotain = require('chevrotain');

const aggregator = require('./src/aggregator');
const { tokens } = require('./src/lib/aggregator/tokens');

module.exports = {
  aggregator,
  tokens: tokens.map(currTok => chevrotain.tokenName(currTok))
};
