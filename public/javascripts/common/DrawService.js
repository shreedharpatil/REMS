angular.module('Common').service('DrawService',function($http,$rootScope,WarningMessageService,CommonModalService){
	return new DrawServiceViewModel($http,$rootScope,WarningMessageService,CommonModalService);
});

var DrawServiceViewModel = function(http,rootScope,warningMessageService,commonModalService)
{
	var self = this;
	self.DrawList = [];
	self.MembershipNumberList = [];
	self.IsMembershipNumberExists = true;	
	self.Draw = {InstallmentNumber:0};
	self.Initialize = function(){
	if(self.MembershipNumberList.length > rootScope.PlotLayoutDetails.number_of_installments){
		return;
	}
	self.MembershipNumberList.push({value:'---- Please Select ----',key:0});
		 var list = _.range(1,rootScope.PlotLayoutDetails.number_of_installments+1);
		_.each(list,function(number){
			self.MembershipNumberList.push({value:number.toString(),key:number});
		});
	};

	self.GetDraws = function(){
		http({method:'GET', url:'/admin/getDraws/'+ self.Draw.Type}).success(function(data){
			self.DrawList = data;
		}).error(function(error){
			alert(error);
			self.DrawList = [];
		});
	};

	self.ViewDrawDetails = function(){
		rootScope.Type = self.Draw.Type;
		warningMessageService.OpenPopup({template:'/showDrawWinnerDetailsModalTemplate',controller:'ViewDrawDetailsModalController',Heading:'Displaying '+ self.Draw.Type + ' winner Details' });
	};
	
	self.Clear = function(){
		self.setPristine();
		self.Draw.InstallmentNumber = 0;
		self.Draw.MembershipNumber = '';
		self.Draw.DrawNumber = '';
		self.IsMembershipNumberExists = true;
	};
	
	this.ValidateMembershipNumber = function(){
		var self = this;
		if(!self.Draw.MembershipNumber){
		return;
		}
		http({method:'GET',url:'/admin/validateMembershipNumber/'+ self.Draw.MembershipNumber}).success(function(data){
			self.IsMembershipNumberExists = data.IsMembershipNumberExists;			
		}).error(function(error){
			self.IsMembershipNumberExists = true;			
		});
	};
	
	self.Save = function(){
		http({method:'POST', url:'/admin/saveDraw', data:self.Draw}).success(function(data){
			warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading: self.Draw.Type + ' Draw', Body:data});
			self.Clear();
			self.GetDraws();
		}).error(function(error){			
			warningMessageService.OpenPopup({template:'/commonModalTemplate',controller:'CommonModalController',Heading: self.Draw.Type + ' Draw', Body:error});
			self.Clear();
		});
	};
}