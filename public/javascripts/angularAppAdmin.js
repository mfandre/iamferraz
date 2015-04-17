(function(){
    var angularApp = angular.module('myApp', ['ngRoute','ngResource','colorpicker.module', 'wysiwyg.module', 'ngTagsInput','ngSanitize']);

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
                //console.log("Notify ajax Sucesso");
                //console.log(response);

                if(response.data.success !== null || response.data.success !== undefined){
                    if(response.data.success == true){
                        if(response.data.config && response.data.config.showNoty != false)
                            noty({ text: response.data.message,type: 'success'});
                    }
                    else if(response.data.success == false){
                        noty({ text: response.data.message,type: 'error'});
                    }
                }

                // do something on success
                $rootScope.$broadcast('ajax', false);
                return response;
            },
            'responseError': function(rejection) {
                //console.log("Notify ajax Erro");

                noty({ text: "Vixeeee servidor nao respondeu como deveria... FDP!!!",type: 'error'});

                // do something on error
                $rootScope.$broadcast('ajax', false);

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

    angularApp.directive('appFilereader', function($q) {
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    ngModel.$render = function() {};

                    element.bind('change', function(e) {
                        var element = e.target;

                        $q.all(slice.call(element.files, 0).map(readFile))
                            .then(function(values) {
                                if (element.multiple) ngModel.$setViewValue(values);
                                else ngModel.$setViewValue(values.length ? values[0] : null);
                            });

                        function readFile(file) {
                            var deferred = $q.defer();

                            var reader = new FileReader();
                            reader.onload = function(e) {
                                deferred.resolve(e.target.result);
                            };
                            reader.onerror = function(e) {
                                deferred.reject(e);
                            };
                            reader.readAsDataURL(file);

                            return deferred.promise;
                        }

                    }); //change

                } //link
        }; //return
    });

	angularApp.factory('postAjaxServices', function ($http) {
	    return {
			getPosts : function () {
				return $http.post('/post/getPosts');
			},
			createSavePost : function (post) {
				return $http.post('/post/createSavePost', {post:post});
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

    angularApp.factory('userAjaxServices', function ($http) {
        return {
            login : function (user) {
                return $http.post('/user/Login', {user:user});
            },
            getUsers : function () {
                return $http.post('/user/getUsers');
            },
            createSaveUser : function (user) {
                return $http.post('/user/createSaveUser', {user:user});
            },
            deleteUser : function (id) {
                return $http.post('/user/deleteUser', {id:id});
            },
            editUser : function (user) {
                return $http.post('/user/editUser', {user:user});
            },
            getUser : function (id) {
                return $http.post('/user/getUser', {id:id});
            }
        }
    });

    angularApp.factory('categoryAjaxServices', function ($http) {
        return {
            getCategories : function () {
                return $http.post('/category/getCategories');
            },
            createSaveCategory : function (category) {
                return $http.post('/category/createSaveCategory', {category:category});
            },
            deleteCategory : function (id) {
                return $http.post('/category/deleteCategory', {id:id});
            },
            editCategory : function (category) {
                return $http.post('/category/editCategory', {category:category});
            },
            getCategory : function (id) {
                return $http.post('/category/getCategory', {id:id});
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
                keyboardShortcuts: false,
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

    angularApp.controller("AdminPostController", function($scope, $filter, postAjaxServices, categoryAjaxServices){
        $scope.post = {};
        $scope.posts = [];
        $scope.categories = [];
        $scope.modalTitle = "";
        $scope.wysiwygMenu = [
            ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
            ['format-block'],
            ['font'],
            ['font-size'],
            ['font-color', 'hilite-color'],
            ['remove-format'],
            ['ordered-list', 'unordered-list', 'outdent', 'indent'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['code', 'quote', 'paragraph'],
            ['link', 'image']
        ];

        $scope.openCreateEditPostModal = function(title, post){
            $scope.modalTitle = title;
            $scope.post = post;
            $("#create-or-edit-post-modal").modal("show");
        }

        $scope.createSavePost = function(post){
        	postAjaxServices.createSavePost(post)
        		.success(function(data, status, headers, config) {
                    if(data.success && !data.config.modified)
                        $scope.posts.push(data.data);
                });
        }

        $scope.getPosts = function(){
            postAjaxServices.getPosts()
                .success(function(data, status, headers, config) {
                    if(data.success)
                        $scope.posts = data.data;
                });
        }

        $scope.deletePost = function(id){
            postAjaxServices.deletePost(id)
                .success(function(data, status, headers, config) {
                    //removendo post do array de posts
                    $scope.posts = $filter('filter')($scope.posts, {_id: '!' + id})
                });
        }

        $scope.editPost = function(post){
            postAjaxServices.editPost(post);
        }

        $scope.getPost = function(id){
            postAjaxServices.getPost(id);
        }

        $scope.getCategories = function(){
            categoryAjaxServices.getCategories()
                .success(function(data, status, headers, config) {
                    if(data.success)
                        $scope.categories = data.data;
                });
        }

        $scope.loadCategory = function(query){
            return $filter('filter')($scope.categories, {name: query})
        }
    });

    angularApp.controller("AdminUserController", function($scope, $filter, userAjaxServices){
        $scope.user = {};
        $scope.users = [];
        $scope.modalTitle = "";
        
        $scope.openCreateEditUserModal = function(title, user){
            $scope.modalTitle = title;
            $scope.user = user;
            $("#create-or-edit-user-modal").modal("show");

        }

        $scope.createSaveUser = function(user){
            userAjaxServices.createSaveUser(user)
                .success(function(data, status, headers, config) {
                    if(data.success && !data.config.modified)
                        $scope.users.push(data.data);
                });
        }

        $scope.getUsers = function(){
            userAjaxServices.getUsers()
                .success(function(data, status, headers, config) {
                    if(data.success)
                        $scope.users = data.data;
                });
        }

        $scope.deleteUser = function(id){
            userAjaxServices.deleteUser(id)
                .success(function(data, status, headers, config) {
                    //removendo user do array de users
                    $scope.users = $filter('filter')($scope.users, {_id: '!' + id})
                });
        }

        $scope.editUser = function(user){
            userAjaxServices.editUser(user);
        }

        $scope.getUser = function(id){
            userAjaxServices.getUser(id);
        }
    });

    angularApp.controller("AdminCategoryController", function($scope, $filter, categoryAjaxServices){
        $scope.category = {};
        $scope.categories = [];
        $scope.modalTitle = "";
        
        $scope.openCreateEditCategoryModal = function(title, category){
            $scope.modalTitle = title;
            $scope.category = category;
            $("#create-or-edit-category-modal").modal("show");

        }

        $scope.createSaveCategory = function(category){
            categoryAjaxServices.createSaveCategory(category)
                .success(function(data, status, headers, config) {
                    if(data.success && !data.config.modified)
                        $scope.categories.push(data.data);
                });
        }

        $scope.getCategories = function(){
            categoryAjaxServices.getCategories()
                .success(function(data, status, headers, config) {
                    if(data.success)
                        $scope.categories = data.data;
                });
        }

        $scope.deleteCategory = function(id){
            categoryAjaxServices.deleteCategory(id)
                .success(function(data, status, headers, config) {
                    //removendo Category do array de Categories
                    $scope.categories = $filter('filter')($scope.categories, {_id: '!' + id})
                });
        }

        $scope.editCategory = function(category){
            categoryAjaxServices.editCategory(category);
        }

        $scope.getCategory = function(id){
            categoryAjaxServices.getCategory(id);
        }
    });

    angularApp.controller("HomeController", function($scope,$sce, postAjaxServices, categoryAjaxServices){
        $scope.posts = [];
        $scope.categories = [];

        $scope.convertHtml = function(text) {
            return $sce.trustAsHtml(text);
        };

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

        $scope.getCategories = function(){
            categoryAjaxServices.getCategories()
                .success(function(data, status, headers, config) {
                    console.log("getCategories Request feita:");
                    console.log(data);
                    if(data.success)
                        $scope.categories = data.data;
                })
                .error(function(data, status, headers, config) {
                    console.log("getCategories Request deu zica!:");
                });
        }
    });

    angularApp.controller("LoginController", function($scope, userAjaxServices){
        $scope.user = {};

        $scope.login = function(user){
            userAjaxServices.login(user)
                .success(function(data, status, headers, config) {
                    console.log("login Request feita:");
                    console.log(data);
                    if(data.success)
                        window.location = '/admin/portal';
                })
                .error(function(data, status, headers, config) {
                    console.log("login Request deu zica!:");
                    console.log(data);
                });
        }
    });

})();