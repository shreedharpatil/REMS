angular.module('Common').controller('DrawController',function($scope,DrawService,$location){
	$scope.Model = DrawService;
	$scope.Model.Initialize();
	var path = $location.$$absUrl.split('/')[6];
	$scope.Model.IsGold = path == 'gold' ? true:false;	
	$scope.Model.Draw.Type = path;	
	$scope.Model.Link = $scope.Model.IsGold ? "View Gold Winners" : "View Plot Winners";
	$scope.Model.filter = '';
	$scope.Model.GetDraws();
	$scope.Model.setPristine = function(){
	$scope.DrawForm.$setPristine();
	}
	$scope.commonMediater = CommonMediater;
});


