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
      register: $resource(url + '/register'),
      // localhost:8091/api/authService/v1/userInfo
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
        if (this.account.value === undefined){
          this.account.value = this.userInfo.get(
            function (account) {
              return account;
            },
            function () {
              return undefined;
            }
          );
        }
        return this.account.value;
      },

      setAccount: function (account) {
        this.account.value = account;
      },

      // isUserAdmin: function() {
      //   var foundAdminGroup = function(groupList){
      //     if (groupList === undefined){
      //       return false;
      //     }
      //     for (var i = 0; i < groupList.length; i++){
      //       if (groupList[i].adminGroup) {
      //         return true;
      //       }
      //     }
      //     return false;
      //   };
      //
      //   if (this.account.value === undefined){
      //     var self = this;
      //     this.userInfo.get(
      //       function(res){
      //         self.account.value = res;
      //         return foundAdminGroup(res.allowedGroups);
      //       }
      //     );
      //   }
      //   else {
      //     return foundAdminGroup(this.account.value.allowedGroups);
      //   }
      // },

      initActivation: function () {
        $sessionStorage.activation = {activated: false};
      },
      setActivationFlag: function(value) {
        if (this.getActivationFlag() === undefined){
          this.initActivation();
        }
        $sessionStorage.activation.activated = value;
      },
      getActivationFlag: function () {
        return $sessionStorage.activation;
      },
      activationCheckRequired: function() {
        var activationFlag = this.getActivationFlag();
        return  activationFlag === undefined;
      },
      removeActivationFlag: function () {
        if ($sessionStorage.activation !== undefined){
          $sessionStorage.activation = null;
          delete $sessionStorage.activation;
        }
      },

      /**
       * removes user from sessionStorage
       */
      destroy: function() {
        this.removeRegistrationFlag();
        this.removeActivationFlag();
      }

    };

    return service;
  }]);
