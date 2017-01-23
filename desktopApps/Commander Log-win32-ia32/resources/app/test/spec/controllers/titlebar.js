'use strict';

describe('Controller: TitlebarCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var TitlebarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TitlebarCtrl = $controller('TitlebarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TitlebarCtrl.awesomeThings.length).toBe(3);
  });
});
