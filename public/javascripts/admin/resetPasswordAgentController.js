angular.module('Admin').controller('resetPasswordAgentController',function($scope,resetPasswordAgentService,$http){
	$scope.Model = resetPasswordAgentService;
	$scope.commonMediater = CommonMediater;
	$scope.Model.setPristine = function(){
		$scope.ResetPasswordForm.$setPristine();
	};
	$scope.Model.GetAllAgentDetails();
});