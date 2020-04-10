/**
 * Created by shreedhar on 4/22/2015.
 */
angular.module('Common').service('LogoutService',function($http,WarningMessageService,$location,$rootScope){
    return new logoutServiceviewModel($http,WarningMessageService,$location,$rootScope);
});

var logoutServiceviewModel = (function(){
    var model = function(http,warningMessageService,location,rootScope){
        var self =  this;
        self.Body = "Please wait.... Database backup is going on. Please do not close the browser or press back button. You will be notified once it is done. ";
        self.Options = {IsProgressbarShown:true, IsOkButtonShown:false};
        self.Title = "Database backup.";
        self.logout = function(){
            if(!rootScope.IsDbBackupRequired){
                self.logoff();
                return;
            }
            warningMessageService.OpenPopup({template:'/logoutModalTemplate',controller:'LogoutModalController',Callback:self.logoff});
            http({method:'POST', url:'/logout'})
                .success(function(data){
                    self.ChangeProgress(data);
                })
                .error(function(error){
                    alert(error);
                    self.ChangeProgress(error);
                });
        };

        self.ChangeProgress = function(data){
            self.Body = data;
            self.Options.IsProgressbarShown = false;
            self.Options.IsOkButtonShown = true;
        };

        self.logoff = function(){
            var path = location.$$protocol + '://' + location.$$host + ':' + location.$$port + "/";
            window.location = path;
        };
    };
    return model;
})();