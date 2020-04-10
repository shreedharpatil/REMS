angular.module('Agent').service('AgentCustomerDetailsService',function($http,$rootScope,WarningMessageService){	
return new agentCustomerDetailsViewModel($http,$rootScope,WarningMessageService);
});

var agentCustomerDetailsViewModel = function(http,rootScope,warningMessageService){
	this.CustomerList = [];
	this.IsGridView = true;
	rootScope.CustomerBiodataTemplate = "";

	this.ToggleView = function(view){
		this.IsGridView = view != 'grid';
	};

	this.GetAgentCustomerDetails = function(){
		var self = this;
		http({method:'GET' , url:'/agent/agentCustomerMapping/'+ rootScope.AgentDetails.id}).success(function(data){
				console.log(data);
				self.CustomerList = data;
		}).error(function(error){
				console.log(error);
		});
	};
	
	this.showDetails =function(customer){
	rootScope.Customer = customer;
	window.event.cancelBubble = true;
	warningMessageService.OpenPopup({template:'/showAgentCustomerDetailsModalTemplate',controller:'ShowAgentCustomerDetailsModalController',Heading:'Showing details of '+customer.name});
	};
	
	this.EditUser = function(customer){
	rootScope.Customer = customer;
	window.event.cancelBubble = true;
	warningMessageService.OpenPopup({template:'/editAgentCustomerDetailsModalTemplate',controller:'EditAgentCustomerDetailsModalController',Heading:'Showing details of '+customer.name});
	};

	this.HideShow = function(className,bool,index){
		bool ?
			$('div.'+className+'[data-ng-id='+index+']').show() :
			$('div.'+className+'[data-ng-id='+index+']').hide();
	}

	this.ShowCustomerBiodata = function(cust){
		rootScope.customer = angular.copy(cust);
		rootScope.CustomerBiodataTemplate = "/customerBiodataModalTemplate";
	};
};