angular.module('starter')

.directive('blob', function(){
  console.info('Loaded');
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var db = new PouchDB('emr', {auto_compaction: true});
      var row = JSON.parse(attrs.blobItem);
      var filename = attrs.blobFilename;

      // update scope when items are added to show changed images
      scope.$watch("allMeasurements",function(newValue,oldValue) {
        scope.$evalAsync(setBlobSrc);
      });

      function setBlobSrc(){
        db.getAttachment(row._id, filename)
        .then(function (blob) {
          attrs.$set('src', URL.createObjectURL(blob));
        }).catch(function (err) {
          console.log(err);
        });
      }
    }
  };
})

.directive('timeline', function(){
  console.info('Loaded');
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'templates/timeline.template.html',
    link: function (scope, element, attrs) {
        console.info(element);
        console.info('timeline directive');
    }
  };
});
