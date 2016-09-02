'use strict';

describe('Directive: devicetypeicon', function () {

  // load the directive's module
  beforeEach(module('ubirchAdminCrudApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<devicetypeicon></devicetypeicon>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the devicetypeicon directive');
  }));
});
