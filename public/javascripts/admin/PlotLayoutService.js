angular.module('Admin').service('PlotLayoutService',
function($http,WarningMessageService,CommonModalService,$rootScope,CheckExpiryModalService){
return new PlotLayoutViewModel($http,WarningMessageService,CommonModalService,$rootScope,CheckExpiryModalService);
});

var PlotLayoutViewModel =
function(http,warningMessageService,commonModalService,$rootScope,checkExpiryModalService){
this.Plot = {};
var self = this;
this.ConfirmUser = function(){
	var self = this;
	warningMessageService.OpenPopup({template:'/confirmPlotLayout',controller:'PlotLayoutConfirmController',
	Heading:'Setting Plot Layout',
	Callback:self.CreatePlotLayout
	});
};

this.LoadPlotLayoutdetails = function(){
		http({method:'GET',url:'/admin/plotLayoutDetails'}).success(function(data){
				$rootScope.IsLayoutSetUpReady = data.status;
				self.Plot  = data;
				$rootScope.PlotLayoutDetails = data;
				checkExpiryModalService.CheckForAppExpiry();
		}).error(function(error){
			$rootScope.IsLayoutSetUpReady = false;
		});
	};

this.CreatePlotLayout = function(){

	http({method:'POST',url:'/admin/createPlotLayout',data:self.Plot}).success(function(data){
	warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',
	Heading:'Setting Plot Layout',Body:data
	});
	$rootScope.IsLayoutSetUpReady = true;
	}).error(function(error){
	warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',
	Heading:'Setting Plot Layout',Body:error
	});
	$rootScope.IsLayoutSetUpReady = false;
	});
};
}
