var aemModule = angular.module("Common");

aemModule.controller('CommonModalController',
    function ($scope, CommonModalService, $modalInstance, $rootScope) {
        $scope.Model = CommonModalService;
        $scope.Model.Title = $rootScope.Title;
        $scope.Model.Body = $rootScope.Body;
        $scope.Model.HtmlBody = $rootScope.HtmlBody;
        $scope.cancel = function () {
            $modalInstance.dismiss('Canceled');
        }; // end cancel
		
		$scope.Model.apply = function(){
			$scope.$apply();
		};
        $scope.save = function () {
            $modalInstance.close('df');
        };
        $scope.Model.ChangeContentJquery('<h1>THMN</h1>');
    });

aemModule.service('CommonModalService', function () {
    this.Body = '';
    this.Title = '';
    this.HtmlBody = '';
    this.Options = { IsOkButtonShown: true , IsProgressbarShown: false};

    this.ChangeContent = function (body) {
        var self = this;
        self.Body = body;
		//self.apply();
    };

    this.LoadHtmlBody = function(){
        this.ChangeContentJquery(this.HtmlBody);
    };

    this.ChangeContentJquery = function(body){
        $('#content').html(body);
    };
});