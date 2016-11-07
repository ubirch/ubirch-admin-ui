'use strict';

describe('Service: DeviceTypes', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var DeviceTypes;
  beforeEach(inject(function (_DeviceTypes_) {
    DeviceTypes = _DeviceTypes_;
  }));

  it('should do something', function () {
    expect(!!DeviceTypes).toBe(true);
  });

});
