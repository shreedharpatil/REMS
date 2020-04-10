var aemModule = angular.module("Common");

aemModule.controller('AgentDetailsModalController',
    function ($scope, CustomerDetailsModalService, $modalInstance, $rootScope) {
        $scope.Model = CustomerDetailsModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Agent = $rootScope.Agent;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
    });

aemModule.service('AgentDetailsModalService', function () {
    this.Body = '';
    this.Agent = {};
});