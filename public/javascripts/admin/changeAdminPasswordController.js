angular.module('Admin').controller('changeAdminPasswordController',function($scope,changeAdminPasswordService,$http){
	$scope.Model = changeAdminPasswordService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.AdminPasswordChangeForm.$setPristine();
	};
});