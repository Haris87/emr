angular.module('starter.controllers')
.controller('ReferralsCtrl', function($scope, $stateParams, $location, $ionicModal, $ionicPopup) {
  var db = new PouchDB('emr', {auto_compaction: true});
  var id = "referrals";

  ionic.Platform.ready(function(){

  $scope.increaseLimit = function(){
    $scope.limit += $scope.limit;
  }

  $scope.referrals = {};
  $scope.referrals.date = new Date();//.toJSON().slice(0,10);

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
	$scope.allMeasurements = [];

	db.query('index_doctorvisits/object').then(function (res) {
      console.log(res);

      for(var i=0; i<res.rows.length; i++){
        var row = res.rows[i].value.doc;
        row.id = i;
        row.color = $scope.getColor(row);
        if(typeof row.arrythmia == 'undefined'){
          row.arrythmia = false;
        }

		if(typeof row._attachments != 'undefined'){
			console.log(row._attachments.uploaded_file);
			db.getAttachment(row._id, 'referral_file')
			.then(function (blob) {
			  var url = URL.createObjectURL(blob);
			  console.log(url);
			  row.referral_file = url;
			  //$rootScope.$apply();
			}).catch(function (err) {
			  console.log(err);
			});

		}
		console.log(row);

        $scope.allMeasurements.push(row);
      };
      console.log($scope.allMeasurements);
      // db.get(res.rows[0]).then(function(document){
      //   console.log(document);
      // });
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function (err) {
      console.log(err);
      $scope.createIndex();
      $scope.$broadcast('scroll.refreshComplete');
    });

    db.query('index_referrals/object').then(function (res) {
      console.log(res);
      for(var i=0; i<res.rows.length; i++){
        var row = res.rows[i].value.doc;
        row.id = i;
        row.color = $scope.getColor(row);
        if(typeof row.arrythmia == 'undefined'){
          row.arrythmia = false;
        }

		if(typeof row._attachments != 'undefined'){
			console.log(row._attachments.uploaded_file);
			db.getAttachment(row._id, 'referral_file')
			.then(function (blob) {
			  var url = URL.createObjectURL(blob);
			  console.log(url);
			  row.referral_file = url;
			  //$rootScope.$apply();
			}).catch(function (err) {
			  console.log(err);
			});

		}
		console.log(row);

        $scope.allMeasurements.push(row);
      };
      console.log($scope.allMeasurements);
      // db.get(res.rows[0]).then(function(document){
      //   console.log(document);
      // });
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function (err) {
      console.log(err);
      $scope.createIndex();
      $scope.$broadcast('scroll.refreshComplete');
    });
  }


  /*--------------- index - mapreducce ---------------*/

  // document that tells PouchDB/CouchDB
  // to build up an index on doc.name
  $scope.createIndex = function(){

    var ddoc = {
      _id: '_design/index_referrals',
      views: {
        by_id: {
          map: function (doc) {
            if(doc.type == "referrals") {
              emit(doc.id);
            }
          }.toString()
        },
        object: {
          map: function (doc) {
            if(doc.type == "referrals") {
              emit(doc.id, {doc: doc});
            }
          }.toString()
        },
      }
    };

    // save it
    db.get(ddoc._id).then(function(result){
      console.log(result);
    }).catch(function (err) {
      console.log(err);
      if(err.status == 404){
        db.put(ddoc).then(function () {
          console.log("index created");
        }).catch(function (err) {
          console.log(err);
        });
      }
    })


  }
  //$scope.createIndex();

  /*--------------- end index - mapreducce ---------------*/

  $scope.insertReferrals = function(referrals){
	var input = document.getElementById('referral');
	var referral = input.files[0];

	if(typeof referral != 'undefined'){
	  referrals._attachments = {
	    referral_file: {
		  data: referral,
		  content_type: referral.type
	    }
	  };
	}

    referrals.date = new Date(referrals.date);
    referrals.type = "referrals";
    db.post(referrals).then(function(response) {
      console.log(response);

      db.get(response.id).then(function(doc) {
        $scope.closeModal();
      });

    }).catch(function (err) {
      console.log(err);
    });
  }

  $scope.showConfirm = function(doc) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete entry',
       template: 'Are you sure you want to delete this entry?'
     });

     confirmPopup.then(function(res) {
       console.log(doc);
       if(res) {
         doc._deleted = true;
         console.log(db.put(doc));
         $scope.getMeasurements();
         console.log('deleted');
       } else {
         console.log('not deleted');
       }
     });
   };

  $ionicModal.fromTemplateUrl('referrals-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
	console.log(modal);
  });

  $scope.openModal = function() {
	console.log($scope.modal);
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

  setTimeout(function () {
    $scope.getMeasurements();
  }, 500);
});


});
