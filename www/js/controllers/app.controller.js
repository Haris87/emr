
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
      console.log("There was an error during data replication. Replication failed.");
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
      console.log("There was an error during data replication. Replication failed.");
      if(live){
        $scope.replicationIcon = 'live';
      } else {
        $scope.replicationIcon = '';
      }
      $scope.$apply();
    });
  }

  $scope.replicateToLocal();


  // $scope.loginData = {};
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });
  //
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };
  //
  // $scope.login = function() {
  //   $scope.modal.show();
  // };
  //
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);
  //
  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };

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

});
