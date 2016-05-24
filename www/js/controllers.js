angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

})

.controller('DashboardCtrl', function($scope, $rootScope, $stateParams, $state) {
  var db = new PouchDB('emr');

  //chart.js
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.options = {showTooltips: true};
  $scope.chartdata = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  $scope.getProfilePic = function(){
    db.getAttachment('profile', 'pic.jpg')
    .then(function (blob) {
      var url = URL.createObjectURL(blob);
      console.log(url);
      $scope.profilePic = url;
      $rootScope.$apply();
    }).catch(function (err) {
      console.log(err);
    });
  }
  $scope.getProfilePic();


  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.getProfile = function(){
    var id = "profile";
    db.get(id, [{attachments: true}]).then(function (doc) {
      $scope.editable = false;
      $scope.patient = doc.profile;
      console.log(doc);
      console.log($scope.patient);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.output = doc;
    }).catch(function (err) {
      $scope.editable = true;
      $scope.$broadcast('scroll.refreshComplete');
      console.log(err);
    });
  }

  $scope.getProfile();


  $scope.showAllDocs = function(){
    db.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      console.log(result);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.output = result;
    }).catch(function (err) {
      console.log(err);
    });
  }

  $scope.deleteDb = function(){
    db.destroy().then(function (response) {
      $state.reload();
    }).catch(function (err) {
      console.log(err);
    });
  }

  $scope.showAllDocs();
})

.controller('ProfileCtrl', function($scope, $stateParams, $state) {
  var db = new PouchDB('emr');
  var id = "profile";
  $scope.editable = false;
  $scope.patient = {};

  $scope.insertProfile = function(patient){

    var input = document.getElementById('pic_upload');
    var file = input.files[0];

    db.get(id).then(function(doc) {
      return db.put({
        _id: id,
        _rev: doc._rev,
        _attachments: {
          'pic.jpg': {
            data: file,
            content_type: file.type
          }
        },
        profile: patient
      });//return db.getAttachment(id, 'pic.jpg');
    }).then(function(response) {
      $scope.getProfile();
      setTimeout(function () {
        //window.location.reload();
      }, 1);
      $scope.output = response;
    }).catch(function (err) {
      console.log(err);
      if(err.status == 404){
        console.log("inserting profile data...");
        db.put({
          _id: id,
          profile: patient
        }).then(function(response) {
          $scope.getProfile();
        });
      }
    });
  }

  $scope.getProfile = function(){
    var id = "profile";
    db.get(id).then(function (doc) {
      $scope.editable = false;
      $scope.patient = doc.profile;
      console.log(doc);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.output = doc;
    }).catch(function (err) {
      $scope.editable = true;
      $scope.$broadcast('scroll.refreshComplete');
      console.log(err);
    });
  }

  $scope.getProfile();
})

.controller('FamilyCtrl', function($scope, $stateParams) {
  var db = new PouchDB('emr');
  var id = "hereditary";
  $scope.editable = false;
  $scope.hereditary = {};

  $scope.insertHereditary = function(hereditary){
    db.get(id).then(function(doc) {
      return db.put({
        _id: id,
        _rev: doc._rev,
        hereditary: hereditary
      });
    }).then(function(response) {
      $scope.getHereditary();
      setTimeout(function () {
        window.location.reload();
      }, 1);
      $scope.output = response;
    }).catch(function (err) {
      console.log(err);
      if(err.status == 404){
        console.log("inserting hereditary data...");
        db.put({
          _id: id,
          hereditary: hereditary
        }).then(function(response) {
          $scope.getHereditary();
        });
      }
    });
  }

  $scope.getHereditary = function(){
    var id = "hereditary";
    db.get(id).then(function (doc) {
      $scope.editable = false;
      $scope.hereditary = doc.hereditary;
      console.log(doc);
      console.log($scope.editable);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.output = doc;
    }).catch(function (err) {
      $scope.editable = true;
      $scope.$broadcast('scroll.refreshComplete');
      console.log(err);
    });
  }

  $scope.getHereditary();
})

.controller('BloodPressureCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('BloodSugarCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('WeightCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('PhysicalActivityCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('CholesterolCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('AllergiesCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('DisabilitiesCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('SymptomReportsCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('VaccinationsCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('DiseasesCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('DietCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('SmokingCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('AlcoholCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('DiagnosesCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('DoctorVisitsCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('ReferralsCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('HospitalisationsCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('MedicationCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})

.controller('SurgeriesCtrl', function($scope, $stateParams, $location) {
  console.log($location.path());
})
;
