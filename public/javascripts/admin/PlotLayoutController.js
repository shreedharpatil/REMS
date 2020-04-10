angular.module('Admin').controller('PlotLayoutController',function($scope, PlotLayoutService){
	$scope.Model = PlotLayoutService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.LoadPlotLayoutdetails();
});