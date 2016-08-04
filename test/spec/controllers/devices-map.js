'use strict';

describe('Controller: DevicesMapCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var DevicesMapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevicesMapCtrl = $controller('DevicesMapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevicesMapCtrl.awesomeThings.length).toBe(3);
  });
});
