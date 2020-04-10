angular.module('Admin').service('changeAdminPasswordService',function($http,$route,$location,$rootScope,WarningMessageService){

return new changeAdminPasswordServiceViewModel($http,$route,$location,$rootScope,WarningMessageService);
});

var changeAdminPasswordServiceViewModel = function(http,route,location,rootScope,warningMessageService){
    this.ChangeAdminPasswordObj={id : 0};
	this.NewPasswordMismatch = false;
	this.IsCurrentPasswordValid = true;
	var self = this;
	
	
	this.VerifyCurrentPassword = function(){
	if(!self.ChangeAdminPasswordObj.currentPwd){
	return;
	}
		var logindata = {Type:'Admin',UserName:rootScope.AdminDetails.id,Password:self.ChangeAdminPasswordObj.currentPwd};
		http({method:'POST', url:'/login',data:logindata}).success(function(data){
			self.IsCurrentPasswordValid = data.Status;
		}).error(function(error){
			self.IsCurrentPasswordValid = false;
		});
	
	};
	
	this.ChangeAdminPassword = function(){
		var self = this;
		http({method:'POST' , url:'/admin/changeAdminPassword',data:{id:rootScope.AdminDetails.id,currentPwd1:self.ChangeAdminPasswordObj.currentPwd,newPwd11:self.ChangeAdminPasswordObj.newPwd1,newPwd22:self.ChangeAdminPasswordObj.newPwd2}}).success(function(data){
				warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Reset', Body:data});				
				self.Clear();
		}).error(function(error){
			warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Reset', Body:error});				
				self.Clear();
		});
	};
	
		
	
		this.VerifyNewPasswords = function(){
		if( self.ChangeAdminPasswordObj.newPwd1 != self.ChangeAdminPasswordObj.newPwd2){
			self.NewPasswordMismatch = true;
		}
		else{
			self.NewPasswordMismatch = false;
		}
		
	};
	
		this.Clear = function(){
		var self = this;
		self.ChangeAdminPasswordObj={id : 0};
		self.setPristine();
		self.NewPasswordMismatch = false;
		self.IsCurrentPasswordValid = true;
	};
};