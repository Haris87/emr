angular.module('starter.services', [])

.factory('DB', function($http) {
  var info = {};
  info.username = "pincloud";
  info.password = "p1ncl00d";
  info.database_name = "emr";
  info.remote_url = "https://"+info.username+":"+info.password+"@"+info.username+".cloudant.com/"+info.database_name;
  info.localDB = new PouchDB('emr', {auto_compaction: true});
  info.remoteDB = new PouchDB(info.remote_url);

	return {
		info: function(){
			return info;
		},
		doMoreStuff: function(y){
			return y * z;
		}
	}
});
