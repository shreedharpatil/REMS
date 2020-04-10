/**
 * Created by shreedhar on 4/22/2015.
 */
angular.module('Common').controller('LogoutModalController',
    function($scope,LogoutService,$modalInstance){
        $scope.Model = LogoutService;

        $scope.gooff = function(){
            $modalInstance.close('df');
        };
});