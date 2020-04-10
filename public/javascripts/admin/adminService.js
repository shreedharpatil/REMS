angular.module('Admin').service('AdminService',function($http,$route,$location,$rootScope,LogoutService){

return new adminViewModel($http,$route,$location,$rootScope,LogoutService);
});

var adminViewModel = function(http,route,location,rootScope,logoutService){

this.Initialize = function(){
	rootScope.RootPath = 'Home';
};

this.TabClick = function(tabName){
	rootScope.RootPath = tabName;
};

this.logout = function(){
    logoutService.logout();
};

this.GetAdminDetails = function(){
var self=this;
var path = location.$$absUrl.split('/');

http({method:'GET', url:'/admin/admin/'+path[5]}).success(function(data){
rootScope.AdminDetails = data;
}).error(function(error){
rootScope.AgentDetails = null;
});
};

};

angular.module('Admin').config(function($routeProvider){
	$routeProvider.
 when('/registeragent', {
            templateUrl: '/RegisterAgentTemplate',
            controller: 'RegisterAgentController'
        }).
 when('/customerdetails', {
            templateUrl: '/GetAllCustomerDetailsTemplate',
            controller: 'CustomerDetailsController'
        }).
  when('/agentdetails', {
            templateUrl: '/GetAllAgentDetailsTemplate',
            controller: 'AgentDetailsController'
        }).
 when('/home', {
 	templateUrl: '/AdminHomePageTemplate',
            controller: 'AdminHomePageController'
 }).
 
 when('/registerCustomer', {
  templateUrl: '/registerCustomerDetailsTemplate',
            controller: 'RegisterCustomerController'
 }).
 when('/plotLayout', {
  templateUrl: '/plotLayout',
            controller: 'PlotLayoutController'
 }).
 
  when('/resetPasswordAgent', {
  templateUrl: '/resetPasswordAgent',
            controller: 'resetPasswordAgentController'
 }).
 when('/audit', {
  templateUrl: '/audit',
            controller: 'AuditController'
 }).
 when('/changeAdminPassword', {
  templateUrl: '/changeAdminPassword',
            controller: 'changeAdminPasswordController'
 }).
 when('/gold', {
  templateUrl: '/drawTemplate',
  controller: 'DrawController'
 }).
 when('/plot', {
  templateUrl: '/drawTemplate',
  controller: 'DrawController'
 }).
  otherwise({
        redirectTo: '/home'
      });
});