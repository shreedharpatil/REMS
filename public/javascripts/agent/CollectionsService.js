angular.module('Agent').service('CollectionsService',function($http,$rootScope,WarningMessageService,CommonModalService){
	return new CollectionsServiceViewModel($http,$rootScope,WarningMessageService,CommonModalService);
});

CollectionsServiceViewModel = function(http,rootScope,warningMessageService,commonModalService){
	var self = this;
	
	self.Collection = {customer_id:0};
	this.Clear = function(){
		self.setPristine();
	};
	
	this.SaveCollection = function(){
	commonModalService.Options ={ IsOkButtonShown: false , IsProgressbarShown: true};
		warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Saving Collection', Body:'Saving collection details... Please wait.'});
	self.Collection.agent_id = rootScope.AgentDetails.id;
		http({method:'POST',url:'/collection/DoCollection',data:self.Collection}).success(function(data){			
			commonModalService.ChangeContent(data);
			commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};	
			self.Clear();
		}).error(function(error){
			commonModalService.ChangeContent(error);
			commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};				
			self.Clear();
		});
	};
	
	this.Clear = function(){
		self.Collection = {customer_id:0};
		self.setPristine();
	};
	
	this.GetAgentCustomerDetails = function(){
		var self = this;
		http({method:'GET' , url:'/agent/agentCustomerMapping/'+ rootScope.AgentDetails.id}).success(function(data){
				console.log(data);
				self.CustomerList = data;
				_.each(self.CustomerList,function(customer){
					customer.name = customer.name + "---" + customer.id;
				});
				self.CustomerList.unshift({id:0,name:'---- Please select ----'});
		}).error(function(error){
				console.log(error);
		});
	};
	
	this.GetCustomerName = function(){
	if(!self.Collection.customer_id){
		return;
	}
	
		http({method:'GET',url:'/admin/validateMembershipNumber/'+self.Collection.customer_id}).success(function(data){
			self.Collection.name = data.name;
		}).error(function(error){
			self.Collection.name = '';
		});
	};
	
};