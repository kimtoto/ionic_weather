'use strict';
var app = angular.module('App');
    app.controller('WeatherController', function($scope, $http, $stateParams, $ionicActionSheet, $ionicModal, $ionicLoading, Settings, Locations) {
        $scope.params = $stateParams;
        $scope.setting = Settings;
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
        });
        $http.get('/api/forecast/' + $stateParams.lat + ',' +$stateParams.lng, {
            params: {
                units: Settings.units
            }
        })
        .success(function(forecast) {
          $scope.forecast = forecast;
        })
        .then(function() {
          $ionicLoading.hide();
        })
        .error(function(err) {
          console.log(err);
        })

        var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;

        $scope.getWidth = function () {
          return window.innerWidth + 'px';
        };
        $scope.getTotalHeight = function () {
          return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
        };
        $scope.getHeight = function () {
          return parseInt(window.innerHeight - barHeight) + 'px';
        };

        $scope.showOptions = function () {
          var sheet = $ionicActionSheet.show({
              buttons: [
                {text: 'Toggle Favorite'},
                {text: 'Set as Primary'},
                {text: 'Sunrise Sunset Chart'}
              ],
              cancelText: 'Cancle',
              buttonClicked: function (index) {
                  if (index === 0) {
                      Locations.toggle($stateParams);
                  } else if (index === 1) {
                      Locations.primary($stateParams);
                  } else if (index === 2) {
                      $scope.showModal();
                      return true;
                  }
                  return true;
              }
          });
        };

        $scope.showModal = function () {
          if ($scope.modal) {
            $scope.modal.show();
          } else {
            $ionicModal.fromTemplateUrl('views/weather/modal-chart.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.modal = modal;
              var days = [];
              var day = Date.now();
              for (var i = 0; i < 365; i++) {
                day += 1000 * 60 * 60 * 24;
                days.push(SunCalc.getTimes(day, $scope.params.lat, $scope.params.lng));
              }
              $scope.chart = days;
              $scope.modal.show();
            });
          }
        };

        $scope.hideModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    });
