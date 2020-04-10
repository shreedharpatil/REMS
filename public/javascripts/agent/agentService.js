angular.module('Agent').service('AgentService',function($http,$route,$location,$rootScope,LogoutService){

return new agentViewModel($http,$route,$location,$rootScope,LogoutService);
});

var agentViewModel = function(http,route,location,rootScope,logoutService){

this.Initialize = function(){
	rootScope.RootPath = 'Home';
};

this.TabClick = function(tabName){
	rootScope.RootPath = tabName;
};

this.logout = function(){
    logoutService.logout();
};

this.GetAgentDetails = function(){
var self=this;
var path = location.$$absUrl.split('/');

http({method:'GET', url:'/agent/agent/'+path[5]}).success(function(data){
	console.log(data);
rootScope.AgentDetails = data;
}).error(function(error){
	console.log(error)
rootScope.AgentDetails = null;
});
};

};

angular.module('Agent').config(function($routeProvider){
	$routeProvider.
 when('/CustomerDetails', {
            templateUrl: '/servetemplate',
            controller: 'AgentCustomerDetailsController'
        }).
		when('/RegisterCustomer', {
            templateUrl: '/registerCustomerDetailsTemplate',
            controller: 'RegisterCustomerController'
        }).
 when('/home', {
 	templateUrl: '/AgentHomePageTemplate',
            controller: 'AgentHomePageController'
 }).
 when('/collection', {
 	templateUrl: '/Collections',
            controller: 'CollectionsController'
 }).
when('/backDatedCollection', {
    templateUrl: '/backDatedCollections',
    controller: 'BackDatedCollectionsController'
}).
 when('/audit', {
  templateUrl: '/audit',
            controller: 'AuditController'
 }).
  when('/changePassword', {
 	templateUrl: '/changePassword',
            controller: 'changePasswordController'
 }).
  otherwise({
        redirectTo: '/home'
      });
});