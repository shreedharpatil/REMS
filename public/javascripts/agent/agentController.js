angular.module('Agent').controller('AgentController',function($scope,AgentService){
$scope.Model = AgentService;
$scope.Model.Initialize();
$scope.Model.GetAgentDetails();

});