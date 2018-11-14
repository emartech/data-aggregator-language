'use strict';

const _ = require('lodash');

class Period {

  constructor(data) {
    this._data = _(data);
  }

  get lastDay() {
    return this._data.last();
  }

  sum(propertyName) {
    return this._data.sumBy(propertyName);
  }

  average(propertyName) {
    let values = this._data.map(propertyName).compact();
    return values.sum() / values.size();
  }

  last(properytName) {
    return this._data
      .map(properytName)
      .filter(value => value !== undefined)
      .last();
  }

  every(propertyName) {
    return this._data.map(propertyName).compact().value();
  }

  reduce(fn, init) {
    return this._data.reduce(fn, init);
  }

  union(propertyName) {
    return this._data.map(propertyName).reject(x => typeof(x) === 'undefined').flatten().uniq().value();
  }

  get empty() {
    return this._data.compact().size() < 1;
  }

  get emptyLastDay() {
    return !this._data.last();
  }

  get length() {
    return this._data.value().length;
  }

  static create(data) {
    return new Period(data);
  }

}

module.exports = Period;
