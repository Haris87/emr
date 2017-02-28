angular.module('starter.controllers')
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
});
