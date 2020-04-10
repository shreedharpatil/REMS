var adminmodule = angular.module("Common");

adminmodule.controller('EditCustomerDetailsModalController',
    function ($scope, EditCustomerDetailsModalService, $modalInstance, $rootScope) {
        $scope.Model = EditCustomerDetailsModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Customer = $rootScope.Customer;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.Model.close = function () {
            $modalInstance.close('df');
        };
		$scope.commonMediater = CommonMediater;
    });

adminmodule.service('EditCustomerDetailsModalService', function ($http) {
    this.Body = '';
    this.Files = [];
	this.Customer = {};
	
	this.Update = function(){
	var self = this;
		$http({method:'PUT', url:'/admin/updateCustomer', data:self.Customer}).success(function(data){
	if(self.Files[0]){
			self.UploadPhoto(data);	
		}
		else
		{
			alert(data);
			self.close();
		}
	}).error(function(error){
	alert(error);
	self.close();
	});
	};
	
	
	this.filesChanged = function(elt){
		var self = this;
		self.Files = elt.files;	
		self.Customer.image_url = '/customer/' + self.Files[0].name;				
			console.log(self.Agent.image_url);
		};
			
this.UploadPhoto = function(data){
		var self = this;
		var formData = new FormData();	
		            formData.append('customerPhoto', self.Files[0]);
					console.log(formData);
                    $http.post('/admin/uploadCustomerPhoto', formData, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(result) {
                       alert(data);
					   self.close();
                    }).error(function(error){
					alert('failed to upload photo. try again');
					self.close();
					});		
};
});