angular.module('Admin').controller('RegisterAgentController',function($scope,RegisterAgentService,$http){
	$scope.Model = RegisterAgentService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.AgentRegForm.$setPristine();
	};
});