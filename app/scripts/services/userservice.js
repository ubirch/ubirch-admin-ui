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

      isUserAdmin: function() {
        var foundAdminGroup = function(groupList){
          if (groupList === undefined){
            return false;
          }
          for (var i = 0; i < groupList.length; i++){
            if (groupList[i].adminGroup) {
              return true;
            }
          }
          return false;
        };

        if (this.account.value === undefined){
          var self = this;
          this.userInfo.get(
            function(res){
              self.account.value = res;
              return foundAdminGroup(res.allowedGroups);
            }
          );
        }
        else {
          return foundAdminGroup(this.account.value.allowedGroups);
        }
      },

      isUserActivated: function() {
        return this.getAccount().$promise.then(
          function(res){
            return res.activeUser === true ? true : false;
          }
        );
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
