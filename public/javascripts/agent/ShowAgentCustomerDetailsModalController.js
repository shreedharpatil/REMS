var aemModule = angular.module("Common");

aemModule.controller('ShowAgentCustomerDetailsModalController',
    function ($scope, ShowAgentCustomerDetailsModalService, $modalInstance, $rootScope) {
        $scope.Model = ShowAgentCustomerDetailsModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Customer = $rootScope.Customer;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
    });

aemModule.service('ShowAgentCustomerDetailsModalService', function () {
    this.Body = '';
    this.Customer = {};
});