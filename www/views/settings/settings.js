var app = angular.module('App');
    app.controller('SettingController', function($scope, $http, Settings, Locations) {
        $scope.setting = Settings;
        $scope.locations = Locations.data;
        $scope.canDelete = false;

        $scope.remove = function (index) {
            Locations.toggle(Locations.data[index]);
        };
    });
