angular.module('Common').controller('CheckExpiryModalController',
  function($scope,CheckExpiryModalService,$modalInstance){
    $scope.Model = CheckExpiryModalService;
    $scope.cancel = function () {
      $modalInstance.dismiss('Canceled');
    };

    $scope.save = function () {
      $modalInstance.close('df');
    };
});
