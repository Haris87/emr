angular.module('starter.controllers')
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
});
