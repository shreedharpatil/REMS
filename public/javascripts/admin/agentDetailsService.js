angular.module('Admin').service('AgentDetailsService',function($http,$rootScope,WarningMessageService,CommonModalService){
	return new AgentDetailsServiceViewModel($http,$rootScope,WarningMessageService,CommonModalService);
});

var AgentDetailsServiceViewModel = function(http,rootScope,warningMessageService,commonModalService){
	this.AgentList = [];
	this.IsGridView = true;
	rootScope.AgentProfileTemplate = "";

	this.GetAllAgents = function(){
		var self = this;
		http({method:'GET' , url:'/admin/getAllAgents'}).success(function(data){
				self.AgentList = data;
		}).error(function(error){
			console.log(error);
		});
	};
	this.showAgentDetails =function(agent){
	window.event.cancelBubble = true;
	rootScope.Agent = agent;
	warningMessageService.OpenPopup({template:'/showAgentDetailsModalTemplate',controller:'AgentDetailsModalController',Heading:'Showing details of '+agent.name});

	};

	this.HideShow = function(className,bool,index){
		bool ?
			$('div.'+className+'[data-ng-id='+index+']').show() :
			$('div.'+className+'[data-ng-id='+index+']').hide();
	}

	this.ToggleView = function(view){
		this.IsGridView = view != 'grid';
	};

	this.ShowAgentProfile = function(agent){
		rootScope.agent = angular.copy(agent);
		rootScope.AgentProfileTemplate = "/agentProfile";
	};

	this.DeleteAgent = function(agent){
	var self = this;
	window.event.cancelBubble = true;
	http({method:'DELETE', url:'/admin/deleteAgent/'+agent.id}).success(function(data){
	commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};
	warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Customer Deletion',Body:'Agent has been deleted successfully.'});
	commonModalService.ChangeContent(data);	
	var index = self.AgentList.indexOf(agent);
	self.AgentList.splice(index,1);
	}).error(function(error){
	alert(error);
	});
	};
	
	this.EditAgent = function(agent){
	window.event.cancelBubble = true;
	rootScope.Agent = agent;
	warningMessageService.OpenPopup({template:'/editAgentDetailsModalTemplate',controller:'EditAgentDetailsModalController',Heading:'Showing details of '+agent.name});

	};
};