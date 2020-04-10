var aemModule = angular.module("Common");

aemModule.controller('PlotLayoutConfirmController',
    function ($scope, PlotLayoutConfirmModalService, $modalInstance, $rootScope) {
        $scope.Model = PlotLayoutConfirmModalService;
        $scope.Model.Title = $rootScope.Title;        
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.save = function () {
            $modalInstance.close('df');
        };
    });

aemModule.service('PlotLayoutConfirmModalService', function () {
    this.Body = '';
});