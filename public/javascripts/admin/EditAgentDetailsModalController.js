var adminmodule = angular.module("Common");

adminmodule.controller('EditAgentDetailsModalController',
    function ($scope, EditAgentDetailsModalService, $modalInstance, $rootScope) {
        $scope.Model = EditAgentDetailsModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Agent = $rootScope.Agent;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel

        $scope.Model.close = function () {
            $modalInstance.close('df');
        };
		$scope.commonMediater = CommonMediater;
    });

adminmodule.service('EditAgentDetailsModalService', function ($http) {
    this.Body = '';
    this.Agent = {};
	this.Update = function(){
	var self = this;
		$http({method:'PUT', url:'/admin/updateAgent', data:self.Agent}).success(function(data){
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
	this.Files = [];
			this.filesChanged = function(elt){
				var self = this;
				self.Files = elt.files;	
self.Agent.image_url = '/agent/' + self.Files[0].name;				
				console.log(self.Agent.image_url);
			};
			
this.UploadPhoto = function(data){
		var self = this;
		var formData = new FormData();	
		            formData.append('agentPhoto', self.Files[0]);
					console.log(formData);
                    $http.post('/admin/uploadAgentPhoto', formData, {
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