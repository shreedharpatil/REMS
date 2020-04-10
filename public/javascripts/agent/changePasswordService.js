angular.module('Agent').service('changePasswordService',function($http,$route,$location,$rootScope,WarningMessageService,CommonModalService){

return new registerAgentServiceViewModel($http,$route,$location,$rootScope,WarningMessageService,CommonModalService);
});

var registerAgentServiceViewModel = function(http,route,location,rootScope,warningMessageService,commonModalService){
	this.ChangePasswordObj={};
	this.NewPasswordMismatch = false;
	this.IsCurrentPasswordValid = true;
	var self = this;
	this.VerifyCurrentPassword = function(){
	if(!self.ChangePasswordObj.currentPwd){
	return;
	}
	
	var logindata = {Type:'Agent',UserName:rootScope.AgentDetails.id,Password:self.ChangePasswordObj.currentPwd};
		http({method:'POST', url:'/login',data:logindata}).success(function(data){
			self.IsCurrentPasswordValid = data.Status;
		}).error(function(error){
			self.IsCurrentPasswordValid = false;
		});
	};
	
	this.VerifyNewPasswords = function(){
		if( self.ChangePasswordObj.newPwd1 != self.ChangePasswordObj.newPwd2){
			self.NewPasswordMismatch = true;
		}
		else{
			self.NewPasswordMismatch = false;
		}
		
	};
	
	this.ChangePassword = function(){		
		http({method:'POST' , url:'/agent/changePassword',data:{id:rootScope.AgentDetails.id,currentPwd1:self.ChangePasswordObj.currentPwd,newPwd11:self.ChangePasswordObj.newPwd1,newPwd22:self.ChangePasswordObj.newPwd2}}).success(function(data){
				warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Change', Body:data});
				console.log(data);
				self.Clear();
		}).error(function(error){
		warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Change', Body:error});
			console.log(error);
			self.Clear();
		});
	};
	
	this.Clear = function(){
		self.ChangePasswordObj={};
		self.setPristine();
		self.NewPasswordMismatch = false;
		self.IsCurrentPasswordValid = true;
	};
};