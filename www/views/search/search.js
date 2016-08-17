'use strict';
var app = angular.module('App');
    app.controller('SearchController', function($scope, $http, $ionicLoading) {

        $scope.model = {term: ''};

        $scope.search = function() {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
            });
            $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                  address: $scope.model.term
              }
            })
            .success(function(response) {
                console.log(response);
                $scope.results = response.results;
            })
            .then(function() {
                $ionicLoading.hide();
            });
        };
    });
