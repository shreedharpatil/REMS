angular.module('Admin').service('resetPasswordAgentService',function($http,$route,$location,$rootScope,WarningMessageService){

return new resetPasswordAgentServiceViewModel($http,$route,$location,$rootScope,WarningMessageService);
});

var resetPasswordAgentServiceViewModel = function(http,route,location,rootScope,warningMessageService){
	this.ResetPasswordObj={agendId : 0};

	this.GetAllAgentDetails = function(){
	var self = this;
	http({method:'GET' , url:'/admin/getAllAgents'}).success(function(data){
				self.Agents = data;
				_.each(self.Agents,function(agent){
					agent.name = agent.name+" --- "+agent.id;
				});
				
				self.Agents.unshift({id:0, name:'----Please Select ----'});
				
		}).error(function(error){
			alert(error);
		});
	};

	this.ResetPassword = function(){
		var self = this;
		http({method:'POST' , url:'/admin/resetPasswordforAgent',data:{id:self.ResetPasswordObj.agendId}}).success(function(data){
				warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Reset', Body:data});				
				self.Clear();
		}).error(function(error){
			warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Password Reset', Body:error});
			self.Clear();
		});
	};
	
	this.Clear = function(){
		var self = this;
		self.ResetPasswordObj={agendId : 0};
		self.setPristine();
	};
};