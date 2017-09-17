'use strict';

describe('Service: NACL', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var NACL;
  beforeEach(inject(function (_NACL_) {
    NACL = _NACL_;
  }));

  it('should do something', function () {
    expect(!!NACL).toBe(true);
  });

});
