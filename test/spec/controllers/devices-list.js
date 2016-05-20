'use strict';

describe('Controller: DevicesListCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var DevicesListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevicesListCtrl = $controller('DevicesListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevicesListCtrl.awesomeThings.length).toBe(3);
  });
});
