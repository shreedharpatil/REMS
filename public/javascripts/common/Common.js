var commonModule = angular.module("Common", ['dialogs', 'ui.bootstrap']);
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function        ($scope, $timeout, $transition, $q) {
}]).directive('carousel', [function() {
    return {

    }
}]);

commonModule.directive('animate', function () {
    return {
        restrict: 'A',        
        link: function (scope, el, attrs, ctrls) {
            el.addClass('animated bounceInRight');
        }
    };
});

commonModule.directive('scrollBar', function () {
    return {
        restrict: 'A',        
        link: function (scope, el, attrs, ctrls) {
		        var height = scope.$eval(attrs.scrollBar);
				height = height+"px";
            el.css({"height":height});
			el.css({"margin-bottom":"15px"});
			el.css({"overflow":"auto"});			
        }
    };
});

commonModule.factory('myinterceptor', function($rootScope) {
    var myinterceptor = {
        request: function(config) {
            console.log(config);
            return config;
        },
        response: function(response) {
            console.log(response);
            if(response.config.method == "POST" && response.status == 200){
                $rootScope.IsDbBackupRequired = true;
                console.log($rootScope.IsDbBackupRequired);
            }
            return response;
        }
    };
    return myinterceptor;
});

commonModule.config(function($httpProvider) {
    $httpProvider.interceptors.push('myinterceptor');
});

	
	angular.module('Common').directive('datetime', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {

            var formats = [{
               format: "MM, yyyy",
               viewMode: "months",
               minViewMode: "months",
               pickTime: false
           },{
                format: "dd-MM-yyyy",
                viewMode: "dates",
                minViewMode: "dates",
                pickTime: false
            }];
            var choice = parseInt(scope.$eval(attrs.pickerMode));
          element.datetimepicker(formats[choice]).on('changeDate', function(e) {
            ngModelCtrl.$setViewValue(e.date);
            scope.$apply();
          });
        }
    };
});

commonModule.directive('ngValidate', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attrs, ctrls) {
            el.bind('blur', function () {
                var rrno = scope.$eval(attrs.ngValidate);
                $http({ method: "GET", url: '/api/RRNumberValidation?rrno=' + rrno }).
                    success(function (data) {                        
                            ctrls.$setValidity('validRrno', (data == "true" ? true : false));                        
                           // scope.$apply();
                    });
            });
        }
    };
});

commonModule.directive('ngValidateRrno', function ($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attrs, ctrls) {
            console.log('shanta');
            el.bind('blur', function () {
                var rrno = scope.$eval(attrs.ngValidateRrno);
                $http({ method: "GET", url: '/api/RRNumberValidation?rrno=' + rrno }).
                    success(function (data) {
                        ctrls.$setValidity('ngValidateRrno', (data == "true" ? false : true));
                        // scope.$apply();
                    });
            });
        }
    };
});