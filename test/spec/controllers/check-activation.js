'use strict';

describe('Controller: CheckActivationCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var CheckActivationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CheckActivationCtrl = $controller('CheckActivationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CheckActivationCtrl.awesomeThings.length).toBe(3);
  });
});
