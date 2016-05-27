// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'chart.js', 'starter.controllers', 'ngCordova', 'angularMoment'])

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

    .state('app.bloodpressure', {
      url: '/bloodpressure',
      views: {
        'menuContent': {
          templateUrl: 'templates/bloodpressure.html',
          controller: 'BloodPressureCtrl'
        }
      }
    })

    .state('app.bloodsugar', {
      url: '/bloodsugar',
      views: {
        'menuContent': {
          templateUrl: 'templates/bloodsugar.html',
          controller: 'BloodSugarCtrl'
        }
      }
    })

    .state('app.weight', {
      url: '/weight',
      views: {
        'menuContent': {
          templateUrl: 'templates/weight.html',
          controller: 'WeightCtrl'
        }
      }
    })

    .state('app.physicalactivity', {
      url: '/physicalactivity',
      views: {
        'menuContent': {
          templateUrl: 'templates/physicalactivity.html',
          controller: 'PhysicalActivityCtrl'
        }
      }
    })

    .state('app.cholesterol ', {
      url: '/cholesterol',
      views: {
        'menuContent': {
          templateUrl: 'templates/cholesterol.html',
          controller: 'CholesterolCtrl'
        }
      }
    })

    .state('app.allergies', {
      url: '/allergies',
      views: {
        'menuContent': {
          templateUrl: 'templates/allergies.html',
          controller: 'AllergiesCtrl'
        }
      }
    })

    .state('app.disabilities', {
      url: '/disabilities',
      views: {
        'menuContent': {
          templateUrl: 'templates/disabilities.html',
          controller: 'DisabilitiesCtrl'
        }
      }
    })

    .state('app.symptomreports', {
      url: '/symptomreports',
      views: {
        'menuContent': {
          templateUrl: 'templates/symptomreports.html',
          controller: 'SymptomReportsCtrl'
        }
      }
    })

    .state('app.vaccinations', {
      url: '/vaccinations',
      views: {
        'menuContent': {
          templateUrl: 'templates/vaccinations.html',
          controller: 'VaccinationsCtrl'
        }
      }
    })

    .state('app.diseases', {
      url: '/diseases',
      views: {
        'menuContent': {
          templateUrl: 'templates/diseases.html',
          controller: 'DiseasesCtrl'
        }
      }
    })

    .state('app.diet', {
      url: '/diet',
      views: {
        'menuContent': {
          templateUrl: 'templates/diet.html',
          controller: 'DietCtrl'
        }
      }
    })

    .state('app.smoking', {
      url: '/smoking',
      views: {
        'menuContent': {
          templateUrl: 'templates/smoking.html',
          controller: 'SmokingCtrl'
        }
      }
    })

    .state('app.alcohol', {
      url: '/alcohol',
      views: {
        'menuContent': {
          templateUrl: 'templates/alcohol.html',
          controller: 'AlcoholCtrl'
        }
      }
    })

    .state('app.diagnoses', {
      url: '/diagnoses',
      views: {
        'menuContent': {
          templateUrl: 'templates/diagnoses.html',
          controller: 'DiagnosesCtrl'
        }
      }
    })


    .state('app.doctorvisits', {
      url: '/doctorvisits',
      views: {
        'menuContent': {
          templateUrl: 'templates/doctorvisits.html',
          controller: 'DoctorVisitsCtrl'
        }
      }
    })

    .state('app.referrals', {
      url: '/referrals',
      views: {
        'menuContent': {
          templateUrl: 'templates/referrals.html',
          controller: 'ReferralsCtrl'
        }
      }
    })

    .state('app.hospitalisations', {
      url: '/hospitalisations',
      views: {
        'menuContent': {
          templateUrl: 'templates/hospitalisations.html',
          controller: 'HospitalisationsCtrl'
        }
      }
    })

    .state('app.medication', {
      url: '/medication',
      views: {
        'menuContent': {
          templateUrl: 'templates/medication.html',
          controller: 'MedicationCtrl'
        }
      }
    })

    .state('app.surgeries', {
      url: '/surgeries',
      views: {
        'menuContent': {
          templateUrl: 'templates/surgeries.html',
          controller: 'SurgeriesCtrl'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
