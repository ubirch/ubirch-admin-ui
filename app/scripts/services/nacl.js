'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.NACL
 * @description
 * # NACL
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .factory('NACL', [ 'constants', '$window', 'uuid2', 'moment', 'settings', '$resource',
    function (constants, $window, uuid2, moment, settings, $resource) {
    if(!$window.nacl){
      // TODO: If nacl is not available the user should be redirected to a dedicated error page
      return undefined;
    }

    // encode a number to hex
    function decimalToHex(d, padding) {
      var hex = Number(d).toString(16);
      padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

      while (hex.length < padding) {
        hex = "0" + hex;
      }

      return hex;
    }

    // encode a string or byte array to hex
    function toHex(s) {
      // utf8 to latin1
      var h = '';
      for (var i = 0; i < s.length; i++) {
        h += decimalToHex(s[i]);
      }
      return h;
    }

    function toCPPCode(x) {
      var r = "";
      for (var i = 0; i < x.length; i += 16) {
        for (var k = 0; k < 16 && k < x.length; k++) {
          r += "0x" + decimalToHex(x[i + k]) + ","
        }
        r += "\n";
      }
      return r;
    }

    var url = settings.UBIRCH_KEY_SERVICE_API_HOST + constants.KEY_SERVICE_REST_ENDPOINT;

    var service = {
//      https://key.dev.ubirch.com/api/keyService/v1/pubkey/current/hardwareId/12345678901234567890
      keysList: $resource(url + '/pubkey/current/hardwareId/:hardwareId',
        {hardwareId: '@hardwareId'}
      ),

      getCurrentKeysOf: function (hardwareId, callback, errorCallback) {

        this.keysList.query({hardwareId: hardwareId},
          function(data){
            if (callback){
              callback(data);
            }
          },
          function (error) {
            if (errorCallback){
              errorCallback(error);
            }
          }
        );
      },

      // https://key.dev.ubirch.com/api/keyService/v1/pubkey
      keyservice: $resource(url + '/pubkey'),

      generateKeyPairAndStorePubKey: function (hwDeviceId, callback, errorCallback) {

        var keys = $window.nacl.sign.keyPair();

        if (keys !== undefined){
          var created = moment().utc().format(constants.KEY_TIME_FORMAT);
          var validNotAfter = moment().add(1, 'y').utc().format(constants.KEY_TIME_FORMAT);
          var pubKeyInfo = {
            hwDeviceId: hwDeviceId,
            pubKey: nacl.util.encodeBase64(keys.publicKey),
            pubKeyId: uuid2.newuuid(),
            algorithm: "ed25519",
            created: created,
            validNotBefore: created,
            validNotAfter: validNotAfter
          };

          var pubKeyInfoStr = JSON.stringify(pubKeyInfo, Object.keys(pubKeyInfo).sort());
          console.log(pubKeyInfoStr);
          var signature = nacl.sign.detached(nacl.util.decodeUTF8(pubKeyInfoStr), keys.secretKey);

          var payload = {
            pubKeyInfo: pubKeyInfo,
            signature: nacl.util.encodeBase64(signature)
          };
          this.keyservice.save(
            payload,
            function(data){
              if (callback){
                callback(data);
              }
            },
            function (error) {
              if (errorCallback){
                errorCallback(error);
              }
            }
          );
        }

        return keys;
      },

      formatHex: function(key) {
        return toHex(key);
      },
      formatCCP: function(key) {
        return toCPPCode(key);
      }
    };

    return service;


  }]);
