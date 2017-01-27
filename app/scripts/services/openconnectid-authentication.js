'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.openConnectIDAuthentication
 * @description
 * # openConnectIDAuthentication
 * Service in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .factory('Auth', function() {
  var service = {

    authorize: function() {
      window.location.replace(this.url);
    },

    // signOut: function(token) {
    //   if (service.signOutUrl && service.signOutUrl.length > 0) {
    //     var url = service.signOutUrl;
    //     if (service.appendSignoutToken) {
    //       url = url + token;
    //     }
    //     window.location.replace(url);
    //   }
    // },

    init: function(params) {
      service.url = params.authorizationUrl + '?' +
        'client_id=' + encodeURI(params.clientId) + '&' +
        'redirect_uri=' + encodeURI(params.redirectUrl) + '&' +
        'response_type=' + encodeURI(params.responseType) + '&' +
        'scope=' + encodeURI(params.scope) + '&' +
        'state=' + encodeURI(params.state);
      service.signOutUrl = params.signOutUrl;
      if (params.signOutAppendToken === 'true') {
        this.appendSignoutToken = true;
      }
      if (params.signOutRedirectUrl.length > 0) {
        this.signOutUrl = this.signOutUrl+ '?post_logout_redirect_uri=' + encodeURI(params.signOutRedirectUrl);
      }
    },

    appendSignoutToken: false
  };

  return service;
});
