angular.module('Admin').controller('AdminController',function($scope,AdminService){
$scope.Model = AdminService;
$scope.Model.Initialize();
$scope.Model.GetAdminDetails();
});
