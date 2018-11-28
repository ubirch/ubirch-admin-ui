'use strict';

describe('Controller: GlobalDeveloperSettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('ubirchAdminCrudApp'));

  var GlobalDeveloperSettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GlobalDeveloperSettingsCtrl = $controller('GlobalDeveloperSettingsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GlobalDeveloperSettingsCtrl.awesomeThings.length).toBe(3);
  });
});
