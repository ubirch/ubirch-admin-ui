'use strict';

describe('Controller: DeviceCrudCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var DeviceCrudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeviceCrudCtrl = $controller('DeviceCrudCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeviceCrudCtrl.awesomeThings.length).toBe(3);
  });
});
