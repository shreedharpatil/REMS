/**
 * Created by shreedhar on 3/14/2015.
 */
angular.module('Common')
    .service('customerBiodataService',
function($http,$rootScope,$filter){
    return new customerBiodataServiceViewModel($http,$rootScope,$filter);
});

var customerBiodataServiceViewModel = function(http,rootScope,filter){
    var self = this;
    self.CustomerDetails = {};
    self.AgentDetails = {};
    self.TransHistoryDetails = [];
    self.Summary = {NumberOfInstallments:0,TotalInstallmentAmount:0,TotalPaidAmount:0,TotalDueAmount:0};

    self.Initialize = function(){
        self.CustomerDetails = rootScope.customer;
    };

    self.GetAgentAndHistoryDetails = function(){
        self.Summary = {NumberOfInstallments:0,TotalInstallmentAmount:0,TotalPaidAmount:0,TotalDueAmount:0};
        self.TransHistoryDetails = [];
        self.AgentDetails = {};
        http({method:'GET', url:'/customer/biodata/'+rootScope.customer.id})
            .success(function(data){
                self.AgentDetails = data.agentDetails;
                self.TransHistoryDetails = data.transDetails;
				//self.TransHistoryDetails = filter('orderBy')(self.TransHistoryDetails, 'installment_number');
                self.Summary.NumberOfInstallments = self.TransHistoryDetails.length;
                _.each(self.TransHistoryDetails,function(trans){
                    self.Summary.TotalInstallmentAmount += parseFloat(trans.total_installment_amount);
                    self.Summary.TotalPaidAmount += parseFloat(trans.paid_amount);
                    self.Summary.TotalDueAmount += parseFloat(trans.due_amount);
                });
            })
            .error(function(error){
                self.Summary = {NumberOfInstallments:0,TotalInstallmentAmount:0,TotalPaidAmount:0,TotalDueAmount:0};
                self.TransHistoryDetails = [];
                self.AgentDetails = {};
                console.log(error);
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

    this.Close = function(){
        rootScope.CustomerBiodataTemplate = "";
        if(rootScope.CustomerProfileTemplate){
            rootScope.CustomerProfileTemplate = "";
        }
    };
};