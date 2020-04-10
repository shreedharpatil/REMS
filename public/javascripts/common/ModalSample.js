var aemModule = angular.module("Common");

aemModule.controller('CustomerDetailsModalController',
    function ($scope, ModalService, $modalInstance, $rootScope) {
        $scope.Model = ModalService;
        $scope.Model.Title = rootScope.Title;
        $scope.Model.Customer = rootScope.Customer;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
    }]);

aemModule.service('ModalService', function () {
    this.Body = '';
    this.Customer = {};
});