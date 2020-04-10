angular.module('Admin').controller('AdminHomePageController',
function($scope,AdminHomePageservice){
	$scope.Model = AdminHomePageservice;
	$scope.Model.LoadPlotLayoutdetails();
});

angular.module('Admin').service('AdminHomePageservice',
function($http,$rootScope,CheckExpiryModalService){
	return new AdminHomePageserviceViewModel($http,$rootScope,CheckExpiryModalService);
});

AdminHomePageserviceViewModel = function(http,rootScope,checkExpiryModalService){
	this.LoadPlotLayoutdetails = function(){
		http({method:'GET',url:'/admin/plotLayoutDetails'}).success(function(data){
				rootScope.IsLayoutSetUpReady = data.status;
				rootScope.PlotLayoutDetails = data;
				checkExpiryModalService.CheckForAppExpiry();
		}).error(function(error){
			rootScope.IsLayoutSetUpReady = false;
		});
	};
};
