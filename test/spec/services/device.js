'use strict';

describe('Service: Device', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var deviceService;

  beforeEach(inject(function ($injector) {
    deviceService = $injector.get('Device');
  }));

  it('service should exist', function () {
    expect(!!deviceService).toBe(true);
  });



});
