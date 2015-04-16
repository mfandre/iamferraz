(function(){
    var angularApp = angular.module('myApp', ['ngRoute','ngResource']);

    angularApp.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'portal/posts',
                //controller: "LoginController"
            })
            .when('/posts', {
                templateUrl: 'portal/posts',
                //controller: "ChatController"
            })
            .when('/users', {
                templateUrl: 'portal/users',
                //controller: "ProfileController"
            })
            .when('/categories', {
                templateUrl: 'portal/categories',
                //controller: "ProfileController"
            })
            .otherwise({
                redirectTo: '/admin'
            });
    });

    angularApp.factory('ajaxInterceptor', function($q, $rootScope) {
        return {
            'response': function(response) {
                console.log("Notify ajax Sucesso");
                // do something on success
                $rootScope.$broadcast('ajax', false);
                return response;
            },
            'responseError': function(rejection) {
                console.log("Notify ajax Erro");
                // do something on error
                $rootScope.$broadcast('ajax', false);
                if (canRecover(rejection)) {
                    return responseOrNewPromise
                }
                return $q.reject(rejection);
            }
        };
    });

    angularApp.config(function ($httpProvider) {
        $httpProvider.interceptors.push('ajaxInterceptor');
    });

    angularApp.directive('showTab', function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });

	angularApp.factory('postAjaxServices', function ($http) {
	    return {
			getPosts : function () {
				return $http.post('/post/getPosts');
			},
			createPost : function (post) {
				return $http.post('/post/createPost', {post:post});
			},
            deletePost : function (id) {
                return $http.post('/post/deletePost', {id:id});
            },
            editPost : function (post) {
                return $http.post('/post/editPost', {post:post});
            },
            getPost : function (id) {
                return $http.post('/post/getPost', {id:id});
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

    angularApp.controller("MenuController", function($scope){
        $scope.jpm = {};
        // Fast Click for Mobile - removes 300ms delay - https://github.com/ftlabs/fastclick
        FastClick.attach(document.body);

        // Add Bg colour from JS so jPanel has time to initalize
        $('body').css({"background-color":"#333337"});

        $scope.jpm = $.jPanelMenu({
                menu : '#menu-target',
                trigger: '.menu-trigger',
                animated: false,
                beforeOpen : ( function() {
                    if (matchMedia('only screen and (min-width: 992px)').matches) {
                        $('.sidebar').css("left", "250px");
                    }
                }),
                beforeClose : ( function() {
                    $('.sidebar').css("left", "0");
                    $('.writer-icon, .side-writer-icon').removeClass("fadeOutUp");
                })
            });

        $scope.jpm.on();
    });

    angularApp.controller("AdminPostController", function($scope, $filter, postAjaxServices){
        $scope.post = {};
        $scope.posts = [];
        
        $scope.createPost = function(post){
        	postAjaxServices.createPost(post)
        		.success(function(data, status, headers, config) {
                    console.log("craetePost Request feita:");
                    console.log(data);
                    $scope.posts.push(data.data);
                })
                .error(function(data, status, headers, config) {
                    console.log("createPost Request deu zica!:");
                });
        }

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

        $scope.deletePost = function(id){
            postAjaxServices.deletePost(id)
                .success(function(data, status, headers, config) {
                    console.log("deletePost Request feita:");
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log("deletePost Request deu zica!:");
                });

            //removendo post do array de posts
            $scope.posts = $filter('filter')($scope.posts, {_id: '!' + id})
        }

        $scope.editPost = function(post){
            postAjaxServices.editPost(post)
                .success(function(data, status, headers, config) {
                    console.log("editPost Request feita:");
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log("editPost Request deu zica!:");
                });
        }

        $scope.getPost = function(id){
            postAjaxServices.getPost(id)
                .success(function(data, status, headers, config) {
                    console.log("getPost Request feita:");
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log("getPost Request deu zica!:");
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