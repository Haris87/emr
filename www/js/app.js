// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('app.family', {
      url: '/family',
      views: {
        'menuContent': {
          templateUrl: 'templates/family.html',
          controller: 'FamilyCtrl'
        }
      }
    })

    .state('app.measurements', {
      url: '/measurements',
      views: {
        'menuContent': {
          templateUrl: 'templates/measurements.html',
          controller: 'MeasurementsCtrl'
        }
      }
    })

    .state('app.medical', {
      url: '/medical',
      views: {
        'menuContent': {
          templateUrl: 'templates/medical.html',
          controller: 'MedicalCtrl'
        }
      }
    })

    .state('app.habits', {
      url: '/habits',
      views: {
        'menuContent': {
          templateUrl: 'templates/habits.html',
          controller: 'HabitsCtrl'
        }
      }
    })

    .state('app.professionals', {
      url: '/professionals',
      views: {
        'menuContent': {
          templateUrl: 'templates/professionals.html',
          controller: 'ProfessionalsCtrl'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
