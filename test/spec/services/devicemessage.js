'use strict';

describe('Service: DeviceMessage', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var DeviceMessage;
  beforeEach(inject(function (_DeviceMessage_) {
    DeviceMessage = _DeviceMessage_;
  }));

  it('should do something', function () {
    expect(!!DeviceMessage).toBe(true);
  });

});
