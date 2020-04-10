angular.module('Common').controller('ViewDrawDetailsModalController',function($scope,ViewDrawDetailsModalService,$modalInstance){
	$scope.Model = ViewDrawDetailsModalService;
	$scope.Model.GetDraws();
	        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
});