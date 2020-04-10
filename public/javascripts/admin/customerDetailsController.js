angular.module('Admin').controller('CustomerDetailsController',function($scope, CustomerDetailsService){
	$scope.Model = CustomerDetailsService;
	$scope.Model.GetAllCustomers();
});