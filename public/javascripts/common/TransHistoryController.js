angular.module('Common').controller('TransHistoryController',function($scope, TransHistoryService,$modalInstance){
	$scope.Model = TransHistoryService;
	$scope.Model.getTransHistory();
	 $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
});