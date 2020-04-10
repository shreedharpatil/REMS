angular.module('Common').service('CheckExpiryModalService',
function($http,CommonModalService,WarningMessageService,$rootScope,$filter){
  return new CheckExpiryModalServiceViewModel($http,CommonModalService,WarningMessageService,$rootScope,$filter);
});

var CheckExpiryModalServiceViewModel =
    function(http,commonModalService,warningMessageService,rootScope,filter){

  var self = this;
  self.ShowPopup = function(head,body,htmlBody){
    warningMessageService.OpenPopup({
      template:'/commonModalTemplate',
      controller:'CommonModalController',
      Heading: head,
      Body: body,
      HtmlBody : htmlBody
    });
  };

  self.CheckForAppExpiry = function(){
    http({method:'GET',url:'/common/isAppExpired'})
    .success(function(data){
      rootScope.IsAppExpired = data.IsExpired;
      var head = 'Application is about to expiry';
      var body;
      var address = 'For more information'+
          ' Contact administrator with below address.</h3>' +
          '<h4>HORIZON INFOTEK</h4>' +
          '<h4>Friends Arcade, Ground Floor</h4>'+
          '<h4>Opp To District Court</h4>' +
          '<h4>Yadgir(D)-585202 ,</h4>' +
          '<h4>cell:91+9741325222, 91+9902131655</h4>';
	  data.renewal_date = filter('date')(data.renewal_date, 'dd-MMM-yyyy');
      if(data.IsIsExpireMonth && !data.IsExpired){
        body = '<h3>Your application is about to expire on :'+ data.renewal_date+'. Try renewing the application.' + address;
        self.ShowPopup(head,'',body);
      }
      else if(data.IsIsExpireMonth && data.IsExpired){
	  head = 'Application Expired.';
        body = '<h3>Your application has expired on: '+ data.renewal_date +'. Please renew it.' + address;
        self.ShowPopup(head,'',body);
      }
    })
    .error(function(error){
      warningMessageService.OpenPopup({
        Title:'Error',
        Body: error
      });
    });

  };
};
