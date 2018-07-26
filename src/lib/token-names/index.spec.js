'use strict';

const subject = require('./');
const { createToken } = require('chevrotain');

const firstToken = createToken({
  name: 'firstToken',
  pattern: /some-pattern/
});

const secondToken = createToken({
  name: 'secondToken',
  pattern: /some-other-pattern/
});

describe('Token Names', function() {
  context('given a list of tokens', function() {
    it('exports the list of token names', function() {
      expect(subject([firstToken, secondToken])).to.deep.equal(['firstToken', 'secondToken']);
    });
  });
});
