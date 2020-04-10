angular.module('Common').controller('RegisterCustomerController',function($scope, RegisterCustomerService){
	$scope.Model = RegisterCustomerService;
	$scope.Model.GetAllAgentDetails();
	$scope.Model.Initialize();	
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.CustRegForm.$setPristine();
	};
});