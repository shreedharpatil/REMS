/**
 * Created by shreedhar on 1/17/2015.
 */

angular.module('Agent').controller('BackDatedCollectionsController',
    function($scope,BackDatedCollectionsService){
        $scope.Model = BackDatedCollectionsService;
        $scope.Model.LoadCustomerDetails();
        $scope.Model.LoadInstallmentDetailsList();
        $scope.commonMediater = CommonMediater;
        $scope.Model.setPristine = function(){
            $scope.BackDatedCollectionsForm.$setPristine();
        };
    });
