angular.module('Agent').controller('AgentHomePageController',function($scope,CheckExpiryModalService){
	CheckExpiryModalService.CheckForAppExpiry();
});