/**
 * Created by shreedhar on 3/15/2015.
 */
angular.module('Admin').service('agentProfileService',function($http,$rootScope){
        return new agentProfileServiceViewModel($http,$rootScope);
});

var agentProfileServiceViewModel = function(http,rootScope){
    var self = this;
    self.Summary = {total_installment_amount:0,total_paid_amount:0,total_due_amount:0};
    self.Customers= [];
    self.AgentDetails = {};
    rootScope.CustomerProfileTemplate = "";

    self.GetSummaryAndCustomerDetails = function(){
        self.AgentDetails = rootScope.agent;
        self.Summary = {total_installment_amount:0,total_paid_amount:0,total_due_amount:0};
        http({method:'GET',url:'/agent/profile/'+rootScope.agent.id})
            .success(function(data){
                self.Summary = data.agentSummary;
                CheckForNullAndReplaceWithZero();
                self.Customers = data.customers;
            });
    };

    self.Back = function(){
        rootScope.AgentProfileTemplate = "";
    };

    self.ShowCustomerProfile = function(cust){
        rootScope.customer = angular.copy(cust);
        rootScope.CustomerProfileTemplate = "/customerBiodataModalTemplate";
    };

    var CheckForNullAndReplaceWithZero = function(){
        for(var property in self.Summary){
            self.Summary[property]  = self.Summary[property] ? self.Summary[property] : 0;
        }
    };
};