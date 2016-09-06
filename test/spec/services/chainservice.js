'use strict';

describe('Service: chainservice', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var chainservice;
  beforeEach(inject(function (_chainservice_) {
    chainservice = _chainservice_;
  }));

  it('should do something', function () {
    expect(!!chainservice).toBe(true);
  });

});
