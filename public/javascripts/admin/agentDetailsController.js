angular.module('Admin').controller('AgentDetailsController',function($scope, AgentDetailsService){
	$scope.Model = AgentDetailsService;
	$scope.Model.GetAllAgents();
});