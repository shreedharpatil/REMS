var aemModule = angular.module("Common");

aemModule.controller('CustomerDetailsModalController',
    function ($scope, CustomerDetailsModalService, $modalInstance, $rootScope) {
        $scope.Model = CustomerDetailsModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Customer = $rootScope.Customer;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
    });

aemModule.service('CustomerDetailsModalService', function () {
    this.Body = '';
    this.Customer = {};
});