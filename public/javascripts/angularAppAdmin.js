(function(){
    angular.module('myAppCommon.Directives', []);
    angular.module('myAppCommon.Factories', []);
    angular.module('myAppCommon.Controllers', []);

    var angularAppAdmin = angular.module('myAppAdmin', ['ui.router','ngResource', 'angular-loading-bar', 'ngAnimate', 'colorpicker.module','ngCkeditor','ngTagsInput','ngSanitize','myAppCommon.Directives','myAppCommon.Factories','myAppCommon.Controllers']);

    var angularAppBlog = angular.module('myAppBlog', ['ui.router','ngResource', 'angular-loading-bar', 'ngAnimate','ngSanitize','vcRecaptcha','myAppCommon.Directives','myAppCommon.Factories','myAppCommon.Controllers']);

    //configurando rotas do Admin
    angularAppAdmin.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/admin");

        $stateProvider
            .state('posts', {
                url: "admin/portal/posts",
                templateUrl: "admin/portal/posts"
            })
            .state('users', {
                url: "admin/portal/users",
                templateUrl: "admin/portal/users"
            })
            .state('categories', {
                url: "admin/portal/categories",
                templateUrl: "admin/portal/categories"
            });
    });

    //configurando rotas do Blog
    angularAppBlog.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/posts");

        $stateProvider
            .state('posts', {
                url: "/posts",
                templateUrl: "/posts"
            })
            .state('post', {
                url: "/post",
                templateUrl: "/post"
            })
            .state('contact', {
                url: "/contact",
                templateUrl: "/contact"
            })
            .state('resume', {
                url: "/resume",
                templateUrl: "/resume"
            });
    });

    //configurando interceptor de requisicoes ajax na aplicacao Admin
    angularAppAdmin.config(function ($httpProvider) {
        $httpProvider.interceptors.push('ajaxInterceptor');
    });

    angular.module('myAppCommon.Directives').directive('showTab', function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });

    angular.module('myAppCommon.Directives').directive('appFilereader', function($q) {
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

    angular.module('myAppCommon.Directives').directive('afterRender', ['$timeout', function ($timeout) {
        var def = {
            restrict: 'A',
            terminal: true,
            transclude: false,
            link: function (scope, element, attrs) {
                $timeout(scope.$eval(attrs.afterRender), 0);  //Calling a scoped method
            }
        };
        return def;
    }]);

    angular.module('myAppCommon.Factories').factory('ajaxInterceptor', function($q, $rootScope) {
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

                noty({ text: "Vixeeee servidor não respondeu como deveria... FDP!!!",type: 'error'});

                // do something on error
                $rootScope.$broadcast('ajax', false);

                return $q.reject(rejection);
            }
        };
    });

	angular.module('myAppCommon.Factories').factory('postAjaxServices', function ($http) {
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
            },
            sendCommentToPost : function (comment, postId) {
                return $http.post('/post/sendCommentToPost', {comment: comment, postId:postId});
            }
    	}
	});

    angular.module('myAppCommon.Factories').factory('userAjaxServices', function ($http) {
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

    angular.module('myAppCommon.Factories').factory('categoryAjaxServices', function ($http) {
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

    angular.module('myAppCommon.Controllers').controller("MenuController", function($scope){
        $scope.jpm = {};
        // Fast Click for Mobile - removes 300ms delay - https://github.com/ftlabs/fastclick
        FastClick.attach(document.body);

        $('.menu-trigger').bigSlide();
    });

    angularAppAdmin.controller("AdminPostController", function($scope, $filter, postAjaxServices, categoryAjaxServices){
        $scope.post = {};
        $scope.posts = [];
        $scope.categories = [];
        $scope.modalTitle = "";
        $scope.editorOptions = {
            //customConfig: 'public/javascripts/vendor/ckeditor/config.js'
            extraPlugins: 'codesnippet',
            codeSnippet_theme: 'monokai_sublime'
        };

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

    angularAppAdmin.controller("AdminUserController", function($scope, $filter, userAjaxServices){
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

    angularAppAdmin.controller("AdminCategoryController", function($scope, $filter, categoryAjaxServices){
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

    angularAppAdmin.controller("LoginController", function($scope, userAjaxServices){
        $scope.user = {};

        $scope.login = function(user){
            userAjaxServices.login(user)
                .success(function(data, status, headers, config) {
                    console.log("login Request feita:");
                    console.log(data);
                    if(data.success)
                        window.location = '/admin';
                })
                .error(function(data, status, headers, config) {
                    console.log("login Request deu zica!:");
                    console.log(data);
                });
        }
    });

    angularAppBlog.controller("HomeController", function($scope,$sce,$filter, postAjaxServices, categoryAjaxServices){
        $scope.posts = [];
        $scope.categories = [];
        $scope.filteredPostsByCategory = [];

        $scope.openPost = function(post){
            angularAppBlog.selectedPost = post;
        };

        $scope.convertHtml = function(text) {
            return $sce.trustAsHtml($filter('limitTo')(text, 400) + "...");
        };

        $scope.getPosts = function(){
            postAjaxServices.getPosts()
                .success(function(data, status, headers, config) {
                    //console.log("getPosts Request feita:");
                    //console.log(data);
                    if(data.success)
                        $scope.posts = data.data;
                });
                //.error(function(data, status, headers, config) {
                //    console.log("getPosts Request deu zica!:");
                //});
        };

        $scope.getCategories = function(){
            categoryAjaxServices.getCategories()
                .success(function(data, status, headers, config) {
                    //console.log("getCategories Request feita:");
                    //console.log(data);
                    if(data.success)
                        $scope.categories = data.data;
                });
                //.error(function(data, status, headers, config) {
                //    console.log("getCategories Request deu zica!:");
                //});
        };

        $scope.filterPostsByCategory = function(id){
            $scope.filteredPostsByCategory = $filter('filter')($scope.posts, {category: {_id:id}});
            //console.log($scope.filteredPostsByCategory);
        };
    });

    angularAppBlog.controller("PostController", function($scope,$sce, $window,postAjaxServices, vcRecaptchaService){
        $scope.post = angularAppBlog.selectedPost;
        $scope.comment = {name:"", email:"", comment:""};

        $scope.highlightBlocks = function () {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });

            //gambs para abrir as imagens em um modal
            $('.postContent img').wrap(function() {
                return "<a class='imageLightbox' href='"+this.src+"' data-toggle='lightbox'>";
            });

            $(document).undelegate('*[data-toggle="lightbox"]', 'click');
            $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
                event.preventDefault();
                $(this).ekkoLightbox();
            }); 
        };

        $scope.convertHtml = function(text) {
            return $sce.trustAsHtml(text);
        };

        $scope.goBack = function(){
            $window.history.back();
        };

        $scope.sendComment = function(comment){
            $scope.post.comments.push(comment);
            postAjaxServices.sendCommentToPost(comment, $scope.post._id);
            $scope.comment = {};
        };
    });

})();