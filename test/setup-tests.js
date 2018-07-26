'use strict';
const { expect } = require('chai');

beforeEach('register globals', () => {
  global.expect = expect;
});
