/**
 * Created by shreedhar on 1/17/2015.
 */
angular.module('Agent').service('BackDatedCollectionsService',
function($http,WarningMessageService,CommonModalService,$rootScope){
    return new BackDatedCollectionsServiceViewModel($http,WarningMessageService,CommonModalService,$rootScope);

});

var BackDatedCollectionsServiceViewModel = function(http,warningMessageService,commonModalService,rootScope){
    var self = this;
    self.CustomerList = [];
    self.InstallmentDetails = [];
    self.BackDatedCollection = {InstallmentNumber : 0, CustomerId : 0};

    self.LoadCustomerDetails = function(){
        http({method:'GET' , url:'/agent/agentCustomerMapping/'+ rootScope.AgentDetails.id}).success(function(data){
            self.CustomerList = data;
            _.each(self.CustomerList,function(customer){
                customer.name = customer.name + "---" + customer.id;
            });
            self.CustomerList.unshift({id:0,name:'---- Please select ----'});
        }).error(function(error){
            console.log(error);
        });
    };

    self.SetInstallmentAmount = function(){
       var installment = _.findWhere(self.InstallmentDetails, { InstallmentNumber : self.BackDatedCollection.InstallmentNumber});

        self.BackDatedCollection.PaidAmount = installment.InstallmentAmount;
    };

    self.LoadInstallmentDetailsList = function(){
        http({method:'GET', url:'/collection/loadInstallmentDetails'}).
            success(function(data){
                self.InstallmentDetails = data;
                _.each(self.InstallmentDetails ,function(installment){
                    installment.Value = installment.InstallmentNumber.toString();
                });
                self.InstallmentDetails.unshift({InstallmentNumber:0,Value:'---- Please select ----'});
        }).
            error(function(error){
                warningMessageService.OpenPopup({
                    template:'/commonModalTemplate',
                    controller:'CommonModalController',
                    Heading:'Error in Saving Collection',
                    Body: error});
            });
    };

    self.Clear = function(){
        self.BackDatedCollection = {InstallmentNumber : 0, CustomerId : 0};
        $('input[name="datepicker"]').val('');
        self.setPristine();
    };

    self.SaveBackDatedCollection = function(){
        self.BackDatedCollection.AgentId = rootScope.AgentDetails.id;
        http({method:'POST',url:'/collection/SaveBackDatedCollection',data:self.BackDatedCollection}).
            success(function(data){
                warningMessageService.OpenPopup({
                    template:'/commonModalTemplate',
                    controller:'CommonModalController',
                    Heading:'collection Save',
                    Body: data});
                self.Clear();
            }).
            error(function(error){
                warningMessageService.OpenPopup({
                    template:'/commonModalTemplate',
                    controller:'CommonModalController',
                    Heading:'Error in Saving Collection',
                    Body: error});
            });
    };
};