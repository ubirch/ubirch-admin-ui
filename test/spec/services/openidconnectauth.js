'use strict';

describe('Service: openIdConnectAuth', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var openIdConnectAuth;
  beforeEach(inject(function (_openIdConnectAuth_) {
    openIdConnectAuth = _openIdConnectAuth_;
  }));

  it('should do something', function () {
    expect(!!openIdConnectAuth).toBe(true);
  });

});
