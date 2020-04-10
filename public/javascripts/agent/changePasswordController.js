angular.module('Agent').controller('changePasswordController',function($scope,changePasswordService,$http){
	$scope.Model = changePasswordService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.CollectionsForm.$setPristine();
	};
});