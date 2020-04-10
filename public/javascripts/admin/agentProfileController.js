/**
 * Created by shreedhar on 3/15/2015.
 */

angular.module('Admin').controller('agentProfileController'
    ,function($scope,agentProfileService){
        $scope.Model = agentProfileService;
        $scope.Model.GetSummaryAndCustomerDetails();
    });