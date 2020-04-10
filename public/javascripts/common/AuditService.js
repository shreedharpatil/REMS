angular.module('Common').service('AuditService',function($http,$location,$rootScope,WarningMessageService,$filter){
	return new AuditServiceViewModel($http,$location,$rootScope,WarningMessageService,$filter);
});

var AuditServiceViewModel = function($http,$location,$rootScope,warningMessageService,$filter){
	var self = this;
	self.Audit = {agent_id:0};
	self.TransactionList = [];
	self.TotalPaidAmount = 0;
	self.TotalDueAmount = 0;
	self.TotalInstallmentAmount = 0;
	self.TotalCustomers = 0;
	self.Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	self.showDownloadLink = false;
	this.Initialize = function(){	
	var path = $location.$$absUrl.split('/');
	self.IsAdmin = path[3] == 'admin' ? true:false;
	};
	
	this.GetAllAgentDetails = function(){	
	$http({method:'GET' , url:'/admin/getAllAgents'}).success(function(data){
				self.Agents = data;
				_.each(self.Agents,function(agent){
					agent.name = agent.name+" --- "+agent.id;
				});
				self.Agents.unshift({id:0, name:'----Please Select ----'});
				self.Audit.agent_id = $rootScope.AgentDetails ? $rootScope.AgentDetails.id : 0;
		}).error(function(error){
			alert(error);
		});
	};
	
	this.Format = function(){
		var dateParts = $('#datepicker').val().split(',');
		self.Audit.TransactionDate = self.Months[parseInt(dateParts[0])-1] + dateParts[1];
	};
	
	self.Search = function(){
	self.Format();

		$http({method:'POST', url:'/collection/audit',data:self.Audit}).success(function(data){
			self.TransactionList = data;
			self.PaidDate = data[0].paid_date;
			self.TotalCustomers = data.length;
			self.TotalPaidAmount = 0;
			self.TotalDueAmount = 0;
			self.TotalInstallmentAmount = 0;
			self.showDownloadLink = false;
			_.each(data,function(trans){
				self.TotalPaidAmount += parseFloat(trans.paid_amount);
				self.TotalDueAmount += parseFloat(trans.due_amount);
				self.TotalInstallmentAmount += parseFloat(trans.total_installment_amount);
			});
			self.TransactionList  = $filter('orderBy')(self.TransactionList , 'id', false);
		}).error(function(error){
			alert(error);
		});
	};

	self.generatePdf = function(){
		$http({method:'POST', url :'/reports/generateAuditPdf', data:{history:{TotalPaidAmount:self.TotalPaidAmount, PaidDate : self.PaidDate,
			TotalDueAmount:self.TotalDueAmount,TotalInstallmentAmount:self.TotalInstallmentAmount
		},details:self.TransactionList}}).success(function(data){
			self.downloadLink = data;
			self.showDownloadLink = true;
		})
			.error(function(error){
				console.log(error);
				self.showDownloadLink = false;
				alert(error);
			});
	};

	this.GetStatusClass = function(trans){	
		var classTobeApplied = "";
		if(trans.payment_status_flag == "FP"){
			trans.statusclass = 'label label-success';
		}
		else if(trans.payment_status_flag == "PP"){
			trans.statusclass = 'label label-warning';
		}
		else if(trans.payment_status_flag == "UP"){
			trans.statusclass	 = 'label label-danger red-background';
		}
	};
	
	this.Clear = function(){
		self.filter = '';
		self.Audit.TransactionDate = '';
		self.TransactionList = [];
		$('input[name="datepicker"]').val('');
		self.setPristine();
	};
	
	this.showTransHitstory = function(trans){
		$rootScope.customerId = trans.customer_id;
		$rootScope.Title = 'Showing Trans. History of '+trans.name;
		warningMessageService.OpenPopup({template:'/showTransHistoryModalTemplate',controller:'TransHistoryController',Heading:'Showing Trans. History of '+trans.name});
	};
	};

