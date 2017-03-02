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
        deviceId: '=',
        values: '=',
        activeTab: '='
      },
      link: function postLink(scope) {
        scope.activeTab.filter = "filterbydate";
        scope.todayReached = scope.values.endDate >= constant.TODAY;
        scope.endOfDataReached = false;

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

          var endDate = scope.values.ignoreTime ? new Date(getDateIgnoreTime(scope.values.endDate).getTime() + constant.ONEDAY) : scope.values.endDate;
          var range = (endDate - scope.values.startDate) * direction;

          scope.values.startDate = new Date(scope.values.startDate.getTime() + range);
          scope.values.endDate = new Date(scope.values.endDate.getTime() + range);

          if (scope.values.autoreload){
            loadHistory();
          }

          scope.todayReached = scope.values.endDate >= constant.TODAY;
        }

        function getDateIgnoreTime(date){
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        scope.$watch('deviceId', function() {
          if (scope.deviceId){
            loadHistory();
          }
        });

        scope.$watch('activeTab.filter', function() {
            loadHistory();
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
            Device.getHistoryOfDateRange(scope.deviceId, scope.values.startDate, scope.values.endDate, scope.values.ignoreTime,
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
