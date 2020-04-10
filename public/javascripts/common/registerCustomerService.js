angular.module('Common').service('RegisterCustomerService',function($http,$rootScope,WarningMessageService,$location,CommonModalService){
	return new RegisterCustomerServiceViewModel($http,$rootScope,WarningMessageService,$location,CommonModalService);
});

var RegisterCustomerServiceViewModel = function(http,rootScope,warningMessageService,location,commonModalService){
	this.Customer= {agent_id:0};
	this.Agents = [];
	this.IsAdmin = true;
	this.Files = [];
	this.IsMembershipNumberExists = true;
	
	this.RegisterCustomer= function(){
		var self = this;
		commonModalService.ChangeContent('Customer registration is being performed... Please wait.');
		commonModalService.Options ={ IsOkButtonShown: false , IsProgressbarShown: true};
		warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Customer Registration', Body:'Customer registration is being performed... Please wait.'});
		http({method:'POST' , url:'/admin/registerCustomer', data:self.Customer}).success(function(data){
		if(self.Files[0]){
			self.UploadPhoto(data);	
		}
		else{
			commonModalService.ChangeContent(data);
			commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};	
			self.Clear();		
		}			
				
		}).error(function(error){
			alert(error);
		});
	};

	this.Initialize = function(){
	var self = this;
	var path = location.$$absUrl.split('/');
	self.IsAdmin = path[3] == 'admin' ? true:false;
	};
	
	this.GetAllAgentDetails = function(){
	var self = this;
	http({method:'GET' , url:'/admin/getAllAgents'}).success(function(data){
				self.Agents = data;
				_.each(self.Agents,function(agent){
					agent.name = agent.name+" --- "+agent.id;
				});
				self.Agents.unshift({id:0, name:'----Please Select ----'});
				self.Customer.agent_id = rootScope.AgentDetails ? rootScope.AgentDetails.id : 0;
		}).error(function(error){
			alert(error);
		});
	};
	
	this.Clear = function(){
		var self = this;
		self.Customer = {};
		self.Customer.agent_id = self.IsAdmin ? 0 : rootScope.AgentDetails.id;
		$("input#file").text("");
		self.setPristine();
};
	
	this.filesChanged = function(elt){
		var self = this;
		self.Files = elt.files;	
		self.Customer.image_url = '/customer/' + self.Files[0].name;				
		console.log(self.Customer.image_url);
	};
	
	this.UploadPhoto = function(data){
		var self = this;
		 var formData = new FormData();				
					
                    formData.append('customerPhoto', self.Files[0]);
					console.log(formData);
                    http.post('/admin/uploadCustomerPhoto', formData, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(result) {
					commonModalService.ChangeContent(data);
					commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};   
					self.Clear();							
                    }).error(function(error){
						commonModalService.ChangeContent(error);
						commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};
					});
		/*var formData = new FormData();    
		
        formData.append('customerPhoto', self.Files[0]);
		
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
		
        xhr.open('post', '/admin/uploadCustomerPhoto', true);
		xhr.setRequestHeader('enctype', 'multipart/form-data');
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable)
                console.log((Math.round((e.loaded / e.total) * 100)));
        };
        xhr.onerror = function (e) {
            console.log('error while trying to upload');
        };
        xhr.onload = function () {
           console.log('success');
        };
        xhr.send(formData);	
		*/
};
	
	this.ShowErrorMessage = function(message,heading){
		var self = this;		
		heading = heading ? heading:'Duplicate membership number';
		commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};
		warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:heading,Body:message});
	};
	
	this.ValidateMembershipNumber = function(){
		var self = this;
		if(!self.Customer.id){
		return;
		}
		http({method:'GET',url:'/admin/validateMembershipNumber/'+ self.Customer.id}).success(function(data){
			self.IsMembershipNumberExists = data.IsMembershipNumberExists;
			if(self.IsMembershipNumberExists){
				self.ShowErrorMessage('This membership number is already registered. Try entering different number.');
			}
			else{
				self.CheckMembershipNumberForOutOfLimit();
			}
		}).error(function(error){
			self.IsMembershipNumberExists = true;
			self.ShowErrorMessage(error);
		});
	};

	this.CheckMembershipNumberForOutOfLimit = function(){
		var self = this;
		var plot = rootScope.PlotLayoutDetails;
		var membershipNumber = parseInt(self.Customer.id);
		if(membershipNumber > plot.number_of_plots){
			self.ShowErrorMessage('Please enter membership number less than '+plot.number_of_plots, 'Invalid Membership number');
		}
	};
};