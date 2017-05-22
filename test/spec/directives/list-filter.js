'use strict';

describe('Directive: listFilter', function () {

  // load the directive's module
  beforeEach(module('ubirchAdminCrudApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<list-filter></list-filter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the listFilter directive');
  }));
});
