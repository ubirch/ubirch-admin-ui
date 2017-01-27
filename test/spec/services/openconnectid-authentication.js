'use strict';

describe('Service: openConnectIDAuthentication', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var openConnectIDAuthentication;
  beforeEach(inject(function (_openConnectIDAuthentication_) {
    openConnectIDAuthentication = _openConnectIDAuthentication_;
  }));

  it('should do something', function () {
    expect(!!openConnectIDAuthentication).toBe(true);
  });

});
