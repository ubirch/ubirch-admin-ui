'use strict';

describe('Service: KeyService', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var KeyService;
  beforeEach(inject(function (_KeyService_) {
    KeyService = _KeyService_;
  }));

  it('should do something', function () {
    expect(!!KeyService).toBe(true);
  });

});
