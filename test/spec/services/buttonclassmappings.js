'use strict';

describe('Service: buttonClassMappings', function () {

  // load the service's module
  beforeEach(module('ubirchAdminCrudApp'));

  // instantiate service
  var buttonClassMappings;
  beforeEach(inject(function (_buttonClassMappings_) {
    buttonClassMappings = _buttonClassMappings_;
  }));

  it('should do something', function () {
    expect(!!buttonClassMappings).toBe(true);
  });

});
