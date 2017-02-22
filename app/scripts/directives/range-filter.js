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
        scope.values.startDate = new Date();
        scope.values.endDate = undefined;
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
          var nextday = new Date();
          nextday.setDate(scope.values.startDate.getDate()+1);

          scope.values.startDate = nextday;

          if (nextday > constant.TODAY){
            scope.todayReached = true;
          }

          loadHistory();


        };

        scope.prev_date = function() {
          var prevday = new Date();
          prevday.setDate(scope.values.startDate.getDate()-1);

          scope.values.startDate = prevday;
          loadHistory();
          scope.todayReached = false;
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
                  calculateMap();
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
                  calculateMap();
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

        function calculateMap() {
          angular.forEach(scope.messages, function(message) {
            console.log(message);
          });
        }

      }
    };
  }]);
