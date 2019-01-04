'use strict';

const aggregator = require('./src/aggregator');
const { tokens } = require('./src/aggregator/tokens');
const tokenNames = require('./src/lib/token-names');

module.exports = {
  aggregator,
  tokens: tokenNames(tokens)
};
