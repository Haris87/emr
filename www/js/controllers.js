angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $state, $cordovaNetwork, $ionicActionSheet, DB) {

  ionic.Platform.ready(function(){

    if(ionic.Platform.isAndroid()) {
      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      $scope.$apply();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          $scope.isOnline = true;
          $scope.network = $cordovaNetwork.getNetwork();

          $scope.$apply();
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          console.log("got offline");
          $scope.isOnline = false;
          $scope.network = $cordovaNetwork.getNetwork();

          $scope.$apply();
      });
    } else {
      $scope.isOnline = true;
    }


  });

  $scope.cloudSettings = function() {

    ionic.Platform.ready(function(){
      // Show the action sheet
      var hideSheet =
      $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-ios-cloud-upload"></i> Upload to cloud' },
          { text: '<i class="icon ion-ios-cloud-download"></i> Download from cloud' },
          { text: '<i class="icon ion-ios-cloud"></i> Toggle live sync' }
        ],
        titleText: 'Cloud Settings',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          // 0 = upload, 1 = download, 2 = toggle sync
          if(index == 0){
            $scope.replicateToRemote();
          } else if(index == 1){
            $scope.replicateToLocal();
          } else if(index == 2){
            var live = DB.toggleLive();
            if(live){
              $scope.replicationIcon = 'live';
            } else {
              $scope.replicationIcon = '';
            }

            //$scope.$apply();
          }
          return true;
        }
      });
    });

    // For example's sake, hide the sheet after two seconds
    // $timeout(function() {
    //   hideSheet();
    // }, 2000);

  };

  $scope.replicationIcon = '';

  $scope.replicateToRemote = function(){
    var db = DB.info();
    var remoteDB = db.remoteDB;
    var localDB = db.localDB;
    var live = db.live;
    $scope.replicationIcon = 'upload';
    var rep = PouchDB.replicate(localDB, remoteDB, {
      live: live,
      retry: live
    }).on('change', function (info) {
      // handle change
      $scope.replicationIcon = 'upload';
      $scope.$apply();
    }).on('paused', function (err) {
      // replication paused (e.g. replication up to date, user went offline)

      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }

      $scope.$apply();
    }).on('active', function () {
      // replicate resumed (e.g. new changes replicating, user went back online)
      $scope.replicationIcon = 'upload';
      $scope.$apply();
    }).on('denied', function (err) {
      // a document failed to replicate (e.g. due to permissions)
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    }).on('complete', function (info) {
      // handle complete
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    }).on('error', function (err) {
      // handle error
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
      alert("There was an error during data replication. Replication failed.");
    });
  }

  $scope.replicateToLocal = function(){
    var db = DB.info();
    var remoteDB = db.remoteDB;
    var localDB = db.localDB;
    var live = db.live;
    $scope.replicationIcon = 'download';
    var rep = PouchDB.replicate(remoteDB, localDB, {
      live: live,
      retry: live
    }).on('change', function (info) {
      // handle change
      $scope.replicationIcon = 'download';
      $state.go($state.current, {}, {reload: true});
    }).on('paused', function (err) {
      // replication paused (e.g. replication up to date, user went offline)
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    }).on('active', function () {
      // replicate resumed (e.g. new changes replicating, user went back online)
      $scope.replicationIcon = 'download';
      $scope.$apply();
    }).on('denied', function (err) {
      // a document failed to replicate (e.g. due to permissions)
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    }).on('complete', function (info) {
      // handle complete
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }

      $state.go($state.current, {}, {reload: true});
    }).on('error', function (err) {
      // handle error
      alert("There was an error during data replication. Replication failed.");
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    });
  }

  $scope.replicateToLocal();


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
  var db = new PouchDB('emr', {auto_compaction: true});

  $scope.loaded = false;

  $scope.goToProfile = function(){
    $state.go('app.profile');
  }

  $scope.refresh = function(){
    $scope.getProfile();
    $scope.getHereditary();
  }


  //chart.js
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.options = {showTooltips: true};
  $scope.chartdata = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  // new Morris.Area({
  //   element: 'weightChart',
  //   data: [
  //     { year: '2008', value: 20 },
  //     { year: '2009', value: 10 },
  //     { year: '2010', value: 5 },
  //     { year: '2011', value: 5 },
  //     { year: '2012', value: 20 }
  //   ],
  //   xkey: 'year',
  //   ykeys: ['value'],
  //   labels: ['Value'],
  //   lineColors: ['#60a2c7']
  // });


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
  var db = new PouchDB('emr', {auto_compaction: true});
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
  var db = new PouchDB('emr', {auto_compaction: true});
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
  var db = new PouchDB('emr', {auto_compaction: true});
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

    db.query('index_bloodpressure/object').then(function (res) {
      console.log(res);
      $scope.allMeasurements = [];
      for(var i=0; i<res.rows.length; i++){
        var row = res.rows[i].value.doc;
        row.id = i;
        row.color = $scope.getColor(row);
        if(typeof row.arrythmia == 'undefined'){
          row.arrythmia = false;
        }

        $scope.allMeasurements.push(row);
      };
      console.log($scope.allMeasurements);
      // db.get(res.rows[0]).then(function(document){
      //   console.log(document);
      // });
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function (err) {
      console.log(err);
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.getMeasurements();


  /*--------------- index - mapreducce ---------------*/

  // document that tells PouchDB/CouchDB
  // to build up an index on doc.name
  $scope.createIndex = function(){

    var ddoc = {
      _id: '_design/index_bloodpressure',
      views: {
        by_id: {
          map: function (doc) {
            if(doc.type == "bloodpressure") {
                emit(doc.id);
            }
          }.toString()
        },
        object: {
          map: function (doc) {
            if(doc.type == "bloodpressure") {
                emit(doc.id, {doc: doc});
            }
          }.toString()
        },
      }
    };

    // save it
    db.put(ddoc).then(function () {
      console.log("index created");
    }).catch(function (err) {
      console.log(err);
    });

  }
  $scope.createIndex();

  /*--------------- end index - mapreducce ---------------*/

  $scope.insertBloodPressure = function(bloodpressure){
    bloodpressure.date = new Date(bloodpressure.date);
    bloodpressure.type = "bloodpressure";
    db.post(bloodpressure).then(function(response) {
      console.log(response);

      db.get(response.id).then(function(doc) {
        console.log(doc);
      });

    }).catch(function (err) {
      console.log(err);
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
