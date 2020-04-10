/**
 * Created by shreedhar on 3/14/2015.
 */
angular.module('Common').controller('customerBiodataController',
    function($scope,customerBiodataService){
    $scope.Model = customerBiodataService;
        $scope.Model.Initialize();
        $scope.Model.GetAgentAndHistoryDetails();
});