'use strict';

describe('Directive: DeviceEditableFields', function () {

  // load the directive's module
  beforeEach(module('ubirchAdminCrudApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-device-editable-fields></-device-editable-fields>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the DeviceEditableFields directive');
  }));
});
