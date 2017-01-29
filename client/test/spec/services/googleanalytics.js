'use strict';

describe('Service: googleAnalytics', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var googleAnalytics;
  beforeEach(inject(function (_googleAnalytics_) {
    googleAnalytics = _googleAnalytics_;
  }));

  it('should do something', function () {
    expect(!!googleAnalytics).toBe(true);
  });

});
