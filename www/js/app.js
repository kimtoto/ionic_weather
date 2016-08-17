var app = angular.module('App', ['ionic']);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('search', {
                url: '/search',
                controller: 'SearchController',
                templateUrl: 'views/search/search.html'
            })
            .state('settings', {
                url: '/settings',
                controller: 'SettingController',
                templateUrl: 'views/settings/settings.html'
            })
            .state('weather', {
                url: '/weather/:city/:lat/:lng',
                controller: 'WeatherController',
                templateUrl: 'views/weather/weather.html'
            });

        $urlRouterProvider.otherwise('/search');
    });

    app.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
          if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
          if(window.StatusBar) {
            StatusBar.styleDefault();
          }
        });
      });

    /** @type {[type]} [description]
    *   @description: Locations 서비스를 LeftMenuController에 인젝션 시킨다.(주입)
    */
    app.controller('LeftMenuController', function($scope, Locations) {
        $scope.locations = Locations.data;
    });

    /**
     * [Settings description]
     * @type {Object}
     * @description Settings services
     * */
    app.factory('Settings', function() {
        var Settings = {
          units: 'us',
          days: 8
        };

        return Settings;
    });

    /**
     * [Locations description]
     * @type {Object}
     * @description Locations services
     */
    app.factory('Locations', function () {
        var Locations = {
          data: [{
            city: 'Chicago, IL, USA',
            lat: 41.8781136,
            lng: -87.6297982
          }],
          getIndex: function (item) {
              var index = -1;
              angular.forEach(Locations.data, function (location, i) {
                if (item.lat === location.lat && item.lng === location.lng) {
                    index = i;
                }
              });
              return index;
          },
          toggle: function (item) {
              var index = Locations.getIndex(item);
              if (index >= 0) {
                  Locations.data.splice(index, 1);
              } else {
                  Locations.data.push(item);
              }
          },
          primary: function (item) {
              var index = Locations.getIndex(item);
              if (index >= 0) {
                  Locations.data.splice(index, 1);
                  Locations.data.splice(0, 0, item);
              } else {
                  Locations.data.unshift(item);
              }
          }
        };

        return Locations;
    });

    // 해당 지역의 시간대로 변환하는 timezone필터
    app.filter('timezone', function() {
        return function(input, timezone) {
          if (input && timezone) {
              var time = moment.tz(input * 1000, timezone);
              return time.format('LT');
          }
          return '';
        };
    });

    /**
     * [value description]
     * @type {[type]}
     * @description 강수확률에 대한 필터값이다.
     */
    app.filter('chance', function() {
        return function (chance) {
            var value = Math.round(chance * 10);
            return value * 10;
        }
    });

    /** @type {Object} [description]
    *   @description 날씨 아이콘 필터값
    */
    app.filter('icons', function() {
      var map = {
        'clear-day': 'ion-ios-sunny',
        'clear-night': 'ion-ios-moon',
        rain: 'ion-ios-rainy',
        snow: 'ion-ios-snowy',
        sleet: 'ion-ios-rainy',
        wind: 'ion-ios-flag',
        fog: 'ion-ios-cloud',
        cloudy: 'ion-ios-cloudy',
        'partly-cloudy-day': 'ion-ios-partlysunny',
        'partly-cloudy-night': 'ion-ios-cloudy-night'
      };

      return function (icon) {
        return map[icon] || '';
      }
    });
