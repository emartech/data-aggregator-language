'use strict';

const chevrotain = require('chevrotain');

module.exports = tokens => tokens.map(currTok => chevrotain.tokenName(currTok));
