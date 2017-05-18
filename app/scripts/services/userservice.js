'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.UserService
 * @description
 * # UserService
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
.service('UserService', ['$resource', 'constants', 'settings', '$sessionStorage', '$q',
  function ($resource, constants, settings, $sessionStorage, $q ) {

    var url = settings.UBIRCH_AUTH_SERVICE_API_HOST + constants.USER_SERVICE_REST_ENDPOINT;

    var service = {

      account: {
        value: undefined
      },

    // localhost:8091/api/authService/v1/register
      // TODO: check if token is inserted into header by interceptor for this request
      register: $resource(url + '/register'),
      // localhost:8091/api/authService/v1/userInfo
      // TODO: check if token is inserted into header by interceptor for this request
      userInfo: $resource(url + '/userInfo'),

      initRegistration: function () {
        $sessionStorage.registration = {inProcess: false};
      },
      setRegistrationFlag: function(value) {
        if (this.getRegistrationFlag() === undefined){
          this.initRegistration();
        }
        $sessionStorage.registration.inProcess = value;
      },
      getRegistrationFlag: function () {
        return $sessionStorage.registration;
      },
      isRegistrationFlagSet: function () {
        return $sessionStorage.registration !== undefined && $sessionStorage.registration.inProcess;
      },
      removeRegistrationFlag: function () {
        if ($sessionStorage.registration !== undefined){
          $sessionStorage.registration = null;
          delete $sessionStorage.registration;
        }
      },
      getAccount: function() {
        var self = this;
        return $q(function(resolve) {
          if (self.account.value === undefined){
            self.userInfo.get(
                function(res){
                  self.account.value = res;
                  resolve(self.account);
                },
              function () {
                self.account.value = undefined;
                resolve(self.account);
              });
          }
          else {
            resolve(self.account);
          }
        });
      },

      isUserActivated: function() {
        return true;
        // var foundGroup = function(groupList, groupId){
        //   if (groupList === undefined){
        //     return false;
        //   }
        //   for (var i = 0; i < groupList.length; i++){
        //     if (groupList[i].id === groupId) {
        //       return true;
        //     }
        //   }
        //   return false;
        // };
        //
        // if (this.account.value === undefined){
        //   var self = this;
        //   this.userInfo.get(
        //       function(res){
        //         self.account.value = res;
        //         return foundGroup(res.allowedGroups, constants.ADMIN_GROUP_ID);
        //       }
        //     );
        // }
        // else {
        //   return foundGroup(this.account.value.allowedGroups, constants.ADMIN_GROUP_ID);
        // }
      },
      /**
       * removes user from sessionStorage
       */
      destroy: function() {
        this.removeRegistrationFlag();
      }

    };

    return service;
  }]);
