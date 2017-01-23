'use strict';

describe('Filter: eliteDate', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var eliteDate;
  beforeEach(inject(function ($filter) {
    eliteDate = $filter('eliteDate');
  }));

  it('should return the input prefixed with "eliteDate filter:"', function () {
    var text = 'angularjs';
    expect(eliteDate(text)).toBe('eliteDate filter: ' + text);
  });

});
