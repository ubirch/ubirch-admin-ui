'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.KeyService
 * @description
 * # KeyService
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('KeyService', ['$resource', 'constants', 'settings', '$log', function ($resource, constants, settings, $log) {

    var url = settings.UBIRCH_API_HOST + constants.AVATAR_SERVICE_REST_ENDPOINT;

    var keyServiceResource = $resource(url + '/backendinfo/pubkey');

    var bePubkey;

    keyServiceResource.getBEPubKey = function(){
      if (bePubkey === undefined){
        bePubkey = keyServiceResource.get();
      }
      return bePubkey;
    };

    return keyServiceResource;

  }]);
