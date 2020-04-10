angular.module('Login').service('LoginService',function($http,$location){
console.log('inside service');
return new viewModel($http,$location);
});

var viewModel = (function(){
var model = function(http,location){
this.Login = {UserName:'',Password : '',Type : ''};
this.Status = true;
this.DoLogin = function(){
var self = this;

http({method:'POST', url:'/login', data:self.Login}).success(function(data){
self.Status = data.Status;
if(data.Status){
var path = location.$$protocol + '://' + location.$$host + ':' + location.$$port + data.path+"/"+self.Login.UserName;
window.location = path;
}
}).error(function(err){
console.log(err);
});
};
};
return model;
})();
