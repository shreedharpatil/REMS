angular.module('Common').service('TransHistoryService',function($http,$rootScope,$filter){
	return new TransHistoryServiceViewModel($http,$rootScope,$filter);
});

var TransHistoryServiceViewModel = function(http,rootScope,$filter){
	var self = this;
	self.TransHistory = [];
	self.TotalInstallments = 0;
	self.TotalPaidAmount = 0;
	self.TotalDueAmount = 0;
	self.TotalInstallmentAmount = 0;
	self.showDownloadLink = false;

	self.getTransHistory = function(){
		self.TotalInstallments = 0;
		self.TotalPaidAmount = 0;
		self.TotalDueAmount = 0;
		self.TotalInstallmentAmount = 0;
		self.showDownloadLink = false;
		http({method:'GET', url:'/collection/transHistory/'+rootScope.customerId}).success(function(data){
			self.TransHistory = data;
			self.TotalInstallments = data.length;
			_.each(data,function(trans){
				self.TotalPaidAmount += parseFloat(trans.paid_amount);
				self.TotalDueAmount += parseFloat(trans.due_amount);
				self.TotalInstallmentAmount += parseFloat(trans.total_installment_amount);
			});
			self.TransHistory  = $filter('orderBy')(self.TransHistory , 'installment_number', false);
		}).error(function(error){
			self.TransHistory = [];
		});
	};
	
	self.generatePdf = function(){
		http({method:'POST', url :'/reports/generateTransHistoryPdf', data:{history:{TotalPaidAmount:self.TotalPaidAmount,
		TotalDueAmount:self.TotalDueAmount,TotalInstallmentAmount:self.TotalInstallmentAmount
		},details:self.TransHistory}}).success(function(data){
			self.downloadLink = data;
			self.showDownloadLink = true;
		})
		.error(function(error){
			console.log(error);
			self.showDownloadLink = false;
			alert(error);
		});
	};
	
	self.GetStatusClass = function(trans){	
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
};