'use strict';

/**
 * @ngdoc service
 * @name ubirchAdminCrudApp.buttonClassMappings
 * @description
 * # buttonClassMappings
 * Constant in the ubirchAdminCrudApp.
 */
angular.module('ubirchAdminCrudApp')
  .constant('buttonClassMappings', {
    github: {
      buttonClass: "btn btn-block btn-github",
      iconClass: "ion-social-github"
    },
    ebay: {
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
    },
    google: {
      buttonClass: "btn btn-block btn-google-plus",
      iconClass: "ion-social-google"
    },
    windowslive: {
      buttonClass: "btn btn-block btn-live",
      iconClass: "ion-social-windows"
    },
    paypal: {
      buttonClass: "btn btn-block btn-live",
      iconClass: "fa fa-paypal"
    },
    default: {
      buttonClass: "btn btn-block btn-default",
      iconClass: "ion-log-in"
    }
  });


/*
 <button class="btn btn-block btn-facebook" ng-click="authenticate('facebook')">
 <i class="ion-social-facebook"></i> Sign in with Facebook
 </button>
 <button class="btn btn-block btn-linkedin" ng-click="authenticate('linkedin')">
 <i class="ion-social-linkedin"></i> Sign in with LinkedIn
 </button>
 <button class="btn btn-block btn-instagram" ng-click="authenticate('instagram')">
 <i class="ion-social-instagram"></i> Sign in with Instagram
 </button>
 <button class="btn btn-block btn-twitter" ng-click="authenticate('twitter')">
 <i class="ion-social-twitter"></i> Sign in with Twitter
 </button>
 <button class="btn btn-block btn-foursquare" ng-click="authenticate('foursquare')">
 <i class="fa fa-foursquare"></i> Sign in with Foursquare
 </button>
 <button class="btn btn-block btn-bitbucket" ng-click="authenticate('bitbucket')">
 <i class="fa fa-bitbucket"></i> Sign in with Bitbucket
 </button>
 <button class="btn btn-block btn-yahoo" ng-click="authenticate('yahoo')">
 <i class="ion-social-yahoo"></i> Sign in with Yahoo
 </button>
 <button class="btn btn-block btn-twitch" ng-click="authenticate('twitch')">
 <i class="ion-social-twitch"></i> Sign in with Twitch
 */
