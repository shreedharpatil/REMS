angular.module('Admin').service('RegisterAgentService',function($http,$route,$location,$rootScope,WarningMessageService,CommonModalService){

return new registerAgentServiceViewModel($http,$route,$location,$rootScope,WarningMessageService,CommonModalService);
});

var registerAgentServiceViewModel = function(http,route,location,rootScope,warningMessageService,commonModalService){

this.Agent = {name:'', contact_number:'',email_id:'',image_url:''};
this.Files = [];
			this.filesChanged = function(elt){
				var self = this;
				self.Files = elt.files;	
self.Agent.image_url = '/agent/' + self.Files[0].name;				
				console.log(self.Agent.image_url);
			};
		
this.uploadagentList = function(){
		var self = this;
		var formData = new FormData();	
		            formData.append('agentList', self.Files[0]);
					console.log(formData);
                    http.post('/admin/uploadBulkAgentList', formData, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(result) {
					commonModalService.ChangeContent('Agent data been uploaded successfully.');
					commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false}; 
					self.Clear();
					console.log(result);
                    }).error(function(error){
					commonModalService.ChangeContent(error);
					commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};										
					});
};
		
this.UploadPhoto = function(){
		var self = this;
		var formData = new FormData();	
		            formData.append('agentPhoto', self.Files[0]);
					console.log(formData);
                    http.post('/admin/uploadAgentPhoto', formData, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(result) {
					commonModalService.ChangeContent('Agent has been registered successfully.');
					commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false}; 
					self.Clear();
                    }).error(function(error){
					commonModalService.ChangeContent('Failed to upload photo. try again');
					commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};					
					});
		/*var formData = new FormData();    
		
        formData.append('agentPhoto', self.Files[0]);
		
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
		
        xhr.open('post', '/admin/uploadAgentPhoto', true);
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
        xhr.send(formData);	*/
};

this.SaveAgentDetails = function(){
var self=this;
commonModalService.ChangeContent('Agent registration is being performed... Please wait.');
		commonModalService.Options ={ IsOkButtonShown: false , IsProgressbarShown: true};
		warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading:'Agent Registration',Body:'Agent registration is being performed... Please wait.'});
http({method:'POST', url:'/admin/saveAgent' , data:self.Agent}).success(function(data){	
	if(self.Files[0]){
			self.UploadPhoto(data);	
		}
		else{
			commonModalService.ChangeContent(data);
		commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};	
		self.Clear();		
		}		
}).error(function(error){
	commonModalService.ChangeContent(error);
	commonModalService.Options ={ IsOkButtonShown: true , IsProgressbarShown: false};					
});
};

this.Clear = function(){
	this.Agent = {name:'', contact_number:'',address:''};
	this.setPristine();
};

};