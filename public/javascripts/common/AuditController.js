angular.module('Common').controller('AuditController',function($scope,AuditService){
	$scope.Model = AuditService;	
	$scope.Model.Initialize();
	$scope.Model.GetAllAgentDetails();
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.AuditForm.$setPristine();
	};	
});