angular.module('starter.services', [])

.factory('DB', function($http) {
  var info = {};
  info.live = false;
  info.username = "pincloud";
  info.password = "p1ncl00d";
  info.database_name = "emr";
  console.log(info.live);
  info.remote_url = "https://"+info.username+":"+info.password+"@"+info.username+".cloudant.com/"+info.database_name;
  info.localDB = new PouchDB('emr', {auto_compaction: true});
  info.remoteDB = new PouchDB(info.remote_url);

  return {
		info: function(){
			return info;
		},
		toggleLive: function(status){
      info.live = !info.live;
			return info;
		}
	}
});
