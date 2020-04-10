angular.module('Admin').service('CustomerDetailsService',function($http,$rootScope,WarningMessageService,CommonModalService){
	return new CustomerDetailsServiceViewModel($http,$rootScope,WarningMessageService,CommonModalService);
});

var CustomerDetailsServiceViewModel = function(http,rootScope,warningMessageService,commonModalService){
	this.CustomerList = [];
	this.IsGridView = true;
	rootScope.CustomerBiodataTemplate = "";

	this.ToggleView = function(view){
		this.IsGridView = view != 'grid';
	};

	this.GetAllCustomers = function(){
		var self = this;
		http({method:'GET' , url:'/admin/getAllCustomers'}).success(function(data){
				self.CustomerList = data;
		}).error(function(error){
			console.log(error);
		});
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

	this.showDetails =function(customer){
	rootScope.Customer = customer;
	warningMessageService.OpenPopup({template:'/showCustomerDetailsModalTemplate',controller:'CustomerDetailsModalController',Heading:'Showing details of '+customer.name});
	window.event.cancelBubble = true;
	};
	
	this.DeleteUser = function(customer){
	var self = this;
	window.event.cancelBubble = true;
	http({method:'DELETE', url:'/admin/deleteCustomer/'+customer.id}).success(function(data){		
	commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};
	warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Customer Deletion',Body:'Customer has been deleted successfully.'});
	commonModalService.ChangeContent(data);
	
	var index = self.CustomerList.indexOf(customer);
	self.CustomerList.splice(index,1);
	}).error(function(error){
	alert(error);
	});
	};
	
	this.EditUser = function(customer){
	rootScope.Customer = customer;
	warningMessageService.OpenPopup({template:'/editCustomerDetailsModalTemplate',controller:'EditCustomerDetailsModalController',Heading:'Showing details of '+customer.name});
	window.event.cancelBubble = true;
	};
};