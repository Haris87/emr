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

.controller('DashboardCtrl', function($scope, $rootScope, $stateParams, $state, $ionicPlatform) {
  var db = new PouchDB('emr');

  $scope.loaded = false;

  $scope.goToProfile = function(){
    $state.go('app.profile');
  }

  //chart.js
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.options = {showTooltips: true};
  $scope.chartdata = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  new Morris.Area({
    element: 'weightChart',
    data: [
      { year: '2008', value: 20 },
      { year: '2009', value: 10 },
      { year: '2010', value: 5 },
      { year: '2011', value: 5 },
      { year: '2012', value: 20 }
    ],
    xkey: 'year',
    ykeys: ['value'],
    labels: ['Value'],
    lineColors: ['#60a2c7']
  });

  new Morris.Area({
    element: 'BMIChart',
    data: [
      { y: "2006", a: 100, b: 90 },
      { y: "2007", a: 75,  b: 65 },
      { y: "2008", a: 50,  b: 40 },
      { y: "2009", a: 75,  b: 65 },
      { y: "2010", a: 50,  b: 40 },
      { y: "2011", a: 75,  b: 65 },
      { y: "2012", a: 100, b: 90 }
    ],
    xkey: 'y',
    ykeys: ['a'],
    labels: ['Value'],
    lineColors: ['#c276cf']
  });

  new Morris.Area({
    element: 'bloodSugarChart',
    data: [
      { y: "2006", a: 100, b: 90 },
      { y: "2007", a: 75,  b: 65 },
      { y: "2008", a: 50,  b: 40 },
      { y: "2009", a: 75,  b: 65 },
      { y: "2010", a: 50,  b: 40 },
      { y: "2011", a: 75,  b: 65 },
      { y: "2012", a: 100, b: 90 }
    ],
    xkey: 'y',
    ykeys: ['a'],
    labels: ['Value'],
    lineColors: ['#c7b860']
  });

  new Morris.Line({
    element: 'cholesterolChart',
    data: [
      { y: '2006', a: 100, b: 90, c: 190},
      { y: '2007', a: 75,  b: 85, c: 195 },
      { y: '2008', a: 50,  b: 60, c: 200 },
      { y: '2009', a: 75,  b: 65, c: 220 },
      { y: '2010', a: 50,  b: 90, c: 230 },
      { y: '2011', a: 75,  b: 65, c: 185 },
      { y: '2012', a: 100, b: 76, c: 190 }
    ],
    xkey: 'y',
    ykeys: ['a', 'b', 'c'],
    labels: ['HDL', 'LDL', 'TOT'],
    lineColors: ['#1caf51', '#af1c31', '#af9a1c']
  });

  $scope.getProfilePic = function(){
    db.getAttachment('profile', 'pic.jpg')
    .then(function (blob) {
      var url = URL.createObjectURL(blob);
      console.log(url);
      $scope.profilePic = url;
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
      $scope.loaded = true;
      $scope.output = doc;
    }).catch(function (err) {
      $scope.editable = true;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.loaded = true;
      console.log(err);
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
      $scope.loaded = true;
      $scope.output = doc;
    }).catch(function (err) {
      $scope.editable = true;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.loaded = true;
      console.log(err);
    });
  }

  $scope.getProfile();
  $scope.getHereditary();

  $scope.showAllDocs = function(){
    db.allDocs({
      include_docs: true,
      attachments: false
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
      var data = {};
      if(typeof file == 'undefined'){
        var data = { _id: id, _rev: doc._rev,  _attachments: doc._attachments, profile: patient };
      }else{
        var data = { _id: id, _rev: doc._rev,  _attachments: {
            'pic.jpg': {
              data: file,
              content_type: file.type
            }
          }, profile: patient};
      }
      return db.put(data);//return db.getAttachment(id, 'pic.jpg');
    }).then(function(response) {
      $scope.getProfile();
      setTimeout(function () {
        window.location.reload();
      }, 1);
      $scope.output = response;
    }).catch(function (err) {
      console.log(err);
      if(err.status == 404){
        console.log("inserting profile data...");
        var data = {};
        if(typeof file == 'undefined'){
          console.log("no photo");
          var data = { _id: id, _attachments: doc._attachments, profile: patient };
        } else {
          console.log("photo");
          var data = { _id: id, _attachments: {
              'pic.jpg': {
                data: file,
                content_type: file.type
              }
            },profile: patient};
        }

        db.put(data).then(function(response) {
          console.log(response);
          $state.got('app.dashboard');
        });
      }
    });
  }

  $scope.getProfilePic = function(){
    db.getAttachment('profile', 'pic.jpg')
    .then(function (blob) {
      var url = URL.createObjectURL(blob);
      console.log(url);
      $scope.profilePic = url;
      //$rootScope.$apply();
    }).catch(function (err) {
      console.log(err);
    });
  }
  $scope.getProfilePic();


  $scope.getProfile = function(){
    var id = "profile";
    db.get(id).then(function (doc) {
      $scope.editable = false;
      $scope.patient = doc.profile;
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

.controller('BloodPressureCtrl', function($scope, $stateParams, $location, $ionicModal) {
  var db = new PouchDB('emr');
  var id = "bloodpressure";

  $scope.increaseLimit = function(){
    $scope.limit += $scope.limit;
  }

  $scope.bloodpressure = {};
  $scope.bloodpressure.date = new Date();//.toJSON().slice(0,10);

  $scope.getColor = function(measure){
    var colors = {low: 'blue', high: 'red', prehigh: 'yellow', default: 'bluegray', ideal: 'green'};
    var max_hdl = 200;
    var color = colors.default;

    if(measure.diastolic <= 90 && measure.systolic <= 60){
      color = colors.low;
    } else if (measure.diastolic <= 120 && measure.systolic <= 80){
      color = colors.ideal;
    } else if (measure.diastolic <= 140 && measure.systolic <= 90){
      color = colors.prehigh;
    } else if (measure.diastolic <= 190 && measure.systolic <= 100){
      color = colors.high;
    } else {
      if(measure.diastolic > 140 || measure.systolic > 90 ){
        color = colors.high;
      }

      if(measure.diastolic < 90 || measure.systolic < 60){
        color = colors.low;
      }
    }

    return color;
  }

  $scope.getMeasurements = function(){

    $scope.limit = 5;

    db.get(id).then(function(doc) {
      for (var key in doc.measurements) {
        doc.measurements[key].key = key;
      }

      for(var i=0; i<doc.measurements.length; i++){
        doc.measurements[i].color = $scope.getColor(doc.measurements[i]);
        if(typeof doc.measurements[i].arrythmia == 'undefined'){
          doc.measurements[i].arrythmia = false;
        }
      }

      $scope.allMeasurements = doc.measurements;

    }).then(function(){
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function(err){
      console.log(err);
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.getMeasurements();

  $scope.insertBloodPressure = function(bloodpressure){
    bloodpressure.date = new Date(bloodpressure.date);
    db.get(id).then(function(doc) {
      //return db.remove(doc);
      console.log(doc);
      doc.measurements.push(bloodpressure);
      var data = { _id: id, _rev: doc._rev, measurements: doc.measurements };
      return db.put(data).then(function(response) {
        console.log(response);
        $scope.closeModal();
        //$state.goto('app.dashboard');
      });
    }).then(function(response) {
      console.log(response);
      $scope.closeModal();
    }).catch(function (err) {
      if(err.status == 404){
        console.log("creating array for blood pressure...");
        var data = { _id: id,  measurements: [bloodpressure] };
        db.put(data).then(function(response) {
          console.log(response);
          //$state.goto('app.dashboard');
        });
        $scope.closeModal();
      }
    });
  }

  $ionicModal.fromTemplateUrl('blood-pressure-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.getMeasurements();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

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
