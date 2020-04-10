angular.module('Login').controller('LoginController',function($scope, LoginService){
console.log('inside controller');
$scope.Model = LoginService;
});