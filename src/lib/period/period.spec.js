'use strict';

const Period = require('./period');

describe('Period', function() {
  describe('#union', function() {
    it('works for a single day', function() {
      const data = [{
        date: '2017-08-19',
        set: ['1', '2']
      }];
      expect(Period.create(data).union('set')).to.eql(['1', '2']);
    });

    it('works for two distinct arrays', function() {
      const data = [{
        date: '2017-08-19',
        set: ['1', '2']
      },
      {
        date: '2017-08-20',
        set: ['3', '4']
      }];
      expect(Period.create(data).union('set')).to.eql(['1', '2', '3', '4']);
    });

    it('works for two arrays that contains duplicates', function() {
      const data = [{
        date: '2017-08-19',
        set: ['1', '2']
      },
      {
        date: '2017-08-20',
        set: ['2', '3']
      }];
      expect(Period.create(data).union('set')).to.eql(['1', '2', '3']);
    });

    it('works for property names with dot', function() {
      const data = [{
        date: '2017-08-19',
        data: {
          set: ['1', '2']
        }
      },
      {
        date: '2017-08-20',
        data: {
          set: ['2', '3']
        }
      }];
      expect(Period.create(data).union('data.set')).to.eql(['1', '2', '3']);
    });
  });
});
