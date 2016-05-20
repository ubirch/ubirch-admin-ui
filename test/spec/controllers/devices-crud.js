'use strict';

describe('Controller: DevicesListCrudCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var DevicesCrudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevicesCrudCtrl = $controller('DevicesCrudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevicesCrudCtrl.awesomeThings.length).toBe(3);
  });
});
