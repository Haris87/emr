angular.module('starter.controllers')
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
});
