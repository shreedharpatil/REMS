angular.module('Agent').controller('AgentCustomerDetailsController',function($scope,AgentCustomerDetailsService){
	$scope.Model = AgentCustomerDetailsService;
	$scope.Model.GetAgentCustomerDetails();
});