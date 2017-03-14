'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.chainservice
 * @description
 * # chainservice
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .service('ChainService', ['$resource', 'settings', 'constants', function ($resource, settings, constants) {

    var url = settings.UBIRCH_API_HOST + constants.CHAIN_SERVICE_REST_ENDPOINT;

    return {

      // Query a block's info based on an event hash
      eventHash: $resource(url + '/eventHash' + '/:eventHash',
        {eventHash: '@eventHash'}
      ),

      // Query a block's info based on a block hash
      blockInfo: $resource(url + '/blockInfo' + '/:blockHash',
        {blockHash: '@blockHash'}
      ),

      // Query a full block based on a block hash
      fullBlock: $resource(url + '/fullBlock' + '/:blockHash',
        {blockHash: '@blockHash'}
      ),

      // Query a block's info based on the previous block's hash
      blockInfoByPrevious: $resource(url + '/blockInfoByPrevious' + '/:blockHash',
        {blockHash: '@blockHash'}
      )
    };

  }]);
