'use strict';

describe('Controller: EntryCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EntryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntryCtrl = $controller('EntryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EntryCtrl.awesomeThings.length).toBe(3);
  });
});
