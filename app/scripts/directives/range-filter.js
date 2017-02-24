'use strict';

/**
 * @ngdoc directive
 * @name ubirchAdminCrudApp.directive:rangeFilter
 * @description
 * # rangeFilter
 */
angular.module('ubirchAdminCrudApp')
  .directive('rangeFilter', [ 'Device', 'constant', function (Device, constant) {
    return {
      templateUrl: 'views/directives/range-filter.html',
      restrict: 'E',
      scope: {
        messages: '=',
        deviceId: '='
      },
      link: function postLink(scope) {
        scope.activeFilterTab = "filterbydate";
        scope.todayReached = true;
        scope.values = {};
        scope.values.numOfMessages = 10;
        scope.values.startDate = constant.TODAY;
        scope.values.endDate = constant.TODAY;
        scope.values.startIndex = 0;
        scope.endOfDataReached = false;

        scope.numOfMessagesChanged = function() {
          loadHistory();
        };

        scope.changeTab = function(tabname) {
          scope.activeFilterTab = tabname;
        }

        scope.page_next = function() {
          scope.values.startIndex += scope.values.numOfMessages;
          loadHistory();
        };

        scope.page_prev = function() {
          scope.values.startIndex = scope.values.startIndex >= scope.values.numOfMessages ? scope.values.startIndex - scope.values.numOfMessages : 0;
          loadHistory();
        };

        scope.next_date = function() {
          set_new_range(direction_next);
        };

        scope.prev_date = function() {
          set_new_range(direction_previous);
        };

        var direction_next = 1, direction_previous = -1;

        function set_new_range(direction) {
          if (scope.values.endDate < scope.values.startDate){
            scope.values.endDate = scope.values.startDate;
          }

          var range = (scope.values.endDate - scope.values.startDate + constant.ONEDAY) * direction;

          scope.values.startDate = new Date(scope.values.startDate.getTime() + range);
          scope.values.endDate = new Date(scope.values.endDate.getTime() + range);

          loadHistory();

          scope.todayReached = scope.values.endDate >= constant.TODAY;
        };

        scope.$watch('deviceId', function() {
          if (scope.deviceId){
            loadHistory();
          }
        });

        scope.$watch('activeFilterTab', function() {
            loadHistory();
        });

        scope.load_history = function() {
          loadHistory();
        };

        function loadHistory(){
          if (scope.activeFilterTab === "filterbydate"){
            Device.getHistoryOfDateRange(scope.deviceId, scope.values.startDate, scope.values.endDate,
              function(data){
                if (data.length > 0){
                  scope.messages = data;
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