'use strict';

describe('Service: entries', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var entries;
  beforeEach(inject(function (_entries_) {
    entries = _entries_;
  }));

  it('should do something', function () {
    expect(!!entries).toBe(true);
  });

});
