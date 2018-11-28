'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.KeyService
 * @description
 * # KeyService
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('KeyService', ['$resource', function ($resource) {

    var url = "https://api.ubirch.dev.ubirch.com/api/avatarService/v1/backendinfo/pubkey";

    var keyServiceResource = $resource(url);

    var bePubkey;

    keyServiceResource.getBEPubKey = function(){
      if (bePubkey === undefined){
        bePubkey = keyServiceResource.get();
      }
      return bePubkey;
    };

    return keyServiceResource;

  }]);
