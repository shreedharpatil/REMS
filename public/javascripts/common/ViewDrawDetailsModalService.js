angular.module('Common').service('ViewDrawDetailsModalService',function($http,$rootScope){
	return new ViewDrawDetailsModalServiceViewModel($http,$rootScope);
});

var ViewDrawDetailsModalServiceViewModel = function(http,rootScope){
	var self = this;
	self.DrawList = [];
	self.GetDraws = function(){
		http({method:'GET', url:'/admin/getDraws/'+rootScope.Type}).success(function(data){
			self.DrawList = data;
		}).error(function(error){
			alert(error);
		});
	};
};