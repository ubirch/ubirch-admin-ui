'use strict';

describe('Directive: DeviceTypeList', function () {

  // load the directive's module
  beforeEach(module('ubirchAdminCrudApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-device-type-list></-device-type-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the DeviceTypeList directive');
  }));
});
