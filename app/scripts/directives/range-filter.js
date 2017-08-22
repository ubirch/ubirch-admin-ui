'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:rangeFilter
 * @description
 * # rangeFilter
 */
angular.module('ubirchAdminCrudApp')
  .directive('rangeFilter', [ 'Device', 'constants', 'moment', '$timeout', function (Device, constants, moment, $timeout) {
    return {
      templateUrl: 'views/directives/range-filter.html',
      restrict: 'E',
      scope: {
        messages: '=',
        deviceId: '=',
        values: '=',
        activeTab: '='
      },
      link: function postLink(scope) {
        scope.activeTab.filter = "filterbydate";
        scope.todayReached = scope.values.endDate >= constants.TODAY;
        scope.endOfDataReached = false;

        //*************** range filter ********************//
        scope.numOfMessagesChanged = function() {
          loadHistory();
        };

        scope.page_next = function() {
          scope.values.startIndex = scope.values.startIndex >= scope.values.numOfMessages ? scope.values.startIndex - scope.values.numOfMessages : 0;
          loadHistory();
        };

        scope.page_prev = function() {
          scope.values.startIndex += scope.values.numOfMessages;
          loadHistory();
        };

        //*************** date filter ********************//
        var direction_next = 1, direction_previous = -1;

        scope.next_date = function() {
          set_new_range(direction_next);
        };

        scope.prev_date = function() {
          set_new_range(direction_previous);
        };

        function set_new_range(direction) {
          var from = moment(scope.values.startDate, 'llll');
          var to = moment(scope.values.endDate, 'llll');

          if (from.isAfter(to)){
            var temp = from;
            from = to;
            to = temp;
          }

          var range = (to.diff(from)) * direction;
          from.add(range);
          to.add(range);

          scope.values.startDate = from.format('llll');
          scope.values.endDate = to.format('llll');

          if (scope.values.autoreload){
            loadHistory();
          }
        }

        scope.$watch('deviceId', function() {
          if (scope.deviceId){
            loadHistory();
          }
        });

        var messagesPromise;

        scope.$watch('messages', function() {
          // polling data
          if(messagesPromise !== undefined){
            $timeout.cancel(messagesPromise);
          }
          messagesPromise = $timeout(loadHistory, constants.POLLING_INTERVAL);
        });
        scope.$on('$destroy', function(){
          if (messagesPromise !== undefined){
            $timeout.cancel(messagesPromise);
          }
        });
        scope.$on('auth:signedOut', function () {
          if (messagesPromise !== undefined){
            $timeout.cancel(messagesPromise);
          }
        });

        scope.$watch('activeTab.filter', function(newValue, oldValue) {
          if (oldValue != undefined && newValue != oldValue){
            loadHistory();
          }
        });

        scope.$watch('values.endDate', function(){
          scope.todayReached = moment(scope.values.endDate, 'llll').isSameOrAfter(moment().subtract(1, 'm'));
        });

        scope.switchToDateTime = function(){
          scope.values.ignoreTime = false;
        };

        scope.switchAutoreload = function(){
          scope.values.autoreload = !scope.values.autoreload;
        };

        scope.autoreload_history = function() {
          if (scope.values.autoreload){
            loadHistory();
          }
        };

        scope.load_history = function() {
          loadHistory();
        };

        function loadHistory(){
          if (scope.activeTab.filter === "filterbydate"){
            if (scope.values.startDate === undefined && scope.values.endDate === undefined){
              Device.getHistoryOfRange(scope.deviceId, scope.values.startIndex, scope.values.numOfMessages,
                function(data){
                  if (data.length > 0){
                    scope.messages = data;
                    var from = moment(scope.messages[0].timestamp);
                    var to = moment(scope.messages[data.length-1].timestamp);
                    if (from.isBefore(to)){
                      scope.values.startDate = from.format('llll');
                      scope.values.endDate = to.format('llll');
                    }
                    else {
                      scope.values.startDate = to.format('llll');
                      scope.values.endDate = from.format('llll');
                    }
                    scope.todayReached = true;
                    scope.endOfDataReached = false;
                  }
                  else {
                    scope.messages = [];
                  }
                },
                function(){
                  scope.messages = [];
                });
            }
            else {
              Device.getHistoryOfDateRange(scope.deviceId, scope.values.startDate, scope.values.endDate, scope.values.ignoreTime,
                function(data){
                  if (data.length > 0){
                    scope.messages = data;
                  }
                  else {
                    scope.messages = [];
                  }
                },
                function(){
                  scope.messages = [];
                });
            }

          }
          else {
            Device.getHistoryOfRange(scope.deviceId, scope.values.startIndex, scope.values.numOfMessages,
              function(data){
                if (data.length > 0){
                  scope.messages = data;
                  scope.endOfDataReached = false;
                }
                else {
                  scope.messages = [];
                  disableNextButton();
                }
              },
              function(){
                scope.messages = [];
                disableNextButton();
              });
          }
        }

        function disableNextButton() {
          scope.values.startIndex = scope.values.startIndex >= scope.values.numOfMessages ? scope.values.startIndex - scope.values.numOfMessages : 0;
          scope.endOfDataReached = true;
        }

      }
    };
  }]);
