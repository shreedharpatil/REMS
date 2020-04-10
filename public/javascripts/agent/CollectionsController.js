angular.module('Agent').controller('CollectionsController',function($scope,CollectionsService){
	$scope.Model = CollectionsService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.CollectionsForm.$setPristine();
	};
	$scope.Model.GetAgentCustomerDetails();
});