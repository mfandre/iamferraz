(function(){
    var angularApp = angular.module('myApp', []);

	angularApp.factory('postAjaxServices', function ($http) {
	    return {
			getPosts : function () {
				return $http.post('/post/getPosts');
			},
			createPost : function (post) {
				return $http.post('/post/createPost', {post:post});
			}
    	}
	});

    angularApp.factory('loginAjaxServices', function ($http) {
        return {
            login : function (user) {
                return $http.post('/user/Login', {user:user});
            }
        }
    });

    angularApp.controller("PostController", function($scope, postAjaxServices){
        $scope.post = {};
        
        $scope.createPost = function(post){
        	postAjaxServices.createPost(post)
        		.success(function(data, status, headers, config) {
                    console.log("craetePost Request feita:");
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log("createPost Request deu zica!:");
                });
        }
    });

    angularApp.controller("HomeController", function($scope, postAjaxServices){
        $scope.posts = [];

        $scope.getPosts = function(){
        	postAjaxServices.getPosts()
        		.success(function(data, status, headers, config) {
                    console.log("getPosts Request feita:");
                    console.log(data);
                    if(data.success)
                    	$scope.posts = data.data;
                })
                .error(function(data, status, headers, config) {
                    console.log("getPosts Request deu zica!:");
                });
        }
    });


    angularApp.controller("LoginController", function($scope, loginAjaxServices){
        $scope.user = {};

        $scope.login = function(user){
            loginAjaxServices.login(user)
                .success(function(data, status, headers, config) {
                    console.log("login Request feita:");
                    console.log(data);
                    if(data.success)
                        window.location = '/admin/portal';
                })
                .error(function(data, status, headers, config) {
                    console.log("getPosts Request deu zica!:");
                });
        }
    });

})();