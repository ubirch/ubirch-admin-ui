'use strict';

describe('Controller: DeviceDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var DeviceDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeviceDetailsCtrl = $controller('DeviceDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeviceDetailsCtrl.awesomeThings.length).toBe(3);
  });
});
