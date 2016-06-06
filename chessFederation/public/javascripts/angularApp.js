/**
 * Created by sobolrr on 14.05.16.
 */
var app = angular.module('chessFederation', ['ui.router']);

app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home',{
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['posts', function (posts) {
                        return posts.getAll();
                    }]
                }
            });
            $stateProvider.state('posts',{
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostCtrl',
                resolve : {
                    post : ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            });
            $stateProvider.state('userlist',{
                url: '/userlist',
                templateUrl: '/userlist.html',
                controller: 'UserController',
                resolve : {
                    user : ['users', function (users) {
                        return users.getUserList();
                    }]
                }
            });
            $stateProvider.state('useredit',{
                url: '/userlist/useredit/{id}',
                templateUrl: '/useredit.html',
                controller: 'UserController',
                resolve : {
                    user : ['$stateParams', 'users', function ($stateParams, users) {
                        return users.getUser($stateParams.id);
                    }]
                }
            });
            $stateProvider.state('suggestedposts',{
                url: '/suggestedposts',
                templateUrl: '/suggestedposts.html',
                controller: 'PostCtrl',
                resolve : {
                    post : ['posts', function (posts) {
                        return posts.getPendingPost();
                    }]
                }
            });
            $stateProvider.state('edit',{
                url: '/suggestedposts/edit/{id}',
                templateUrl: '/edit.html',
                controller: 'PostCtrl',
                resolve : {
                    post : ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            });
            $stateProvider.state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });
            $stateProvider.state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });

            $urlRouterProvider.otherwise('home');
        }

    ]);

    app.factory('auth', ['$http', '$window', function ($http, $window) {
        var auth = {};

        auth.saveToken = function (token) {
            $window.localStorage['chessFederation-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['chessFederation-token'];
        };

        auth.isLoggedIn = function(){
            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.isModerator = function () {
            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.role == "moderator" && payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.isPublisher = function () {
            var token = auth.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.role == "publisher" && payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function (user) {
            return $http.post('/register', user).success(function (data) {
                auth.saveToken(data.token);
            })
        };

        auth.logIn = function (user) {
            return $http.post('/login', user).success(function (data) {
                auth.saveToken(data.token);
            })
        };

        auth.logOut = function () {
            $window.localStorage.removeItem('chessFederation-token');
        };

        return auth;
    }]);

app.factory('users',['$http', 'auth', '$q', function ($http, auth, $q) {
    var u = {
        users: []
    };
    u.getUser = function(id){
        return $http.get('users/userlist/useredit/' + id).then(function(res){
            return res.data;
        });
    };
    u.getUserList= function () {
        return $http.get('users/userlist/').success(function (data) {
            angular.copy(data, u.users);
        });
    };

    u.removeUser = function (id) {
        var deferred = $q.defer();
        $http.delete('/users/userlist/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };
    
    u.changeRole = function (id) {
        var deferred = $q.defer();
        $http.patch('/users/userlist/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };
    u.saveUserChange = function (id, user) {
        return $http.patch('/users/userlist/useredit/' + id, user,
            {headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function (data) {
            // o.posts.push(data);
        });
    };
    return u;
}]);
    app.factory('posts', ['$http', 'auth', '$q', function ($http, auth, $q) {
    var o = {
        posts: []
    };
    o.getAll= function () {
        return $http.get('/posts').success(function (data) {
            angular.copy(data, o.posts);
        });
    };
    o.getPendingPost= function () {
        return $http.get('/posts/suggestedposts').success(function (data) {
            angular.copy(data, o.posts);
        });
    };
    o.removePost = function (id) {
        var deferred = $q.defer();
        $http.delete('/posts/suggestedposts/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };

    o.approvePost = function (id) {
        var deferred = $q.defer();
        $http.patch('/posts/suggestedposts/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };
    
    o.saveChange = function (id, post) {
        return $http.patch('/posts/suggestedposts/edit/' + id, post,
            {headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function (data) {
            // o.posts.push(data);
        });
    };

    o.create = function (post) {
        return $http.post('/posts', post,
            {headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function (data) {
            o.posts.push(data);
        });
    };
    o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote', null,
            { headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data) {
            post.upvotes += 1;
        });
    };
    o.get = function(id){
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    o.addComments = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment,{
            headers: {Authorization: 'Bearer '+auth.getToken()}
        });
    };
    o.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function (data) {
            comment.upvotes += 1;
        });
    };

    return o;
}]);

app.controller('UserController', [
    '$scope',
    'users',
    'user',
    'auth',
    function ($scope, users, user, auth) {
        $scope.user = user;
        $scope.users = users.users;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.removeUsers = function (userId) {
            users.removeUser(userId).then(function (xxx) {
                users.getUserList().then(function () {
                    $scope.users = users.users;
                });
            });
        };
        $scope.changeRoles = function (userId) {
            users.changeRole(userId).then(function (xxx) {
                users.getUserList().then(function () {
                    $scope.users = users.users;
                });
            });
        };
        $scope.saveUserChanges = function (userId) {
            users.saveUserChange(userId, {
                username: $scope.user.username,
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                role: $scope.user.role,
                email: $scope.user.email,
                sex: $scope.user.sex,
                country: $scope.user.country,
                city: $scope.user.city,
                rank: $scope.user.rank
            });

        };
    }
]);



app.controller('MainCtrl', [
    '$scope',
    'users',
    'posts',
    'auth',
    function ($scope, users, posts, auth) {
        $scope.posts = posts.posts;
        $scope.users = users.users;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addPost = function () {
            if(!$scope.title || $scope.title === '') {return;}
            posts.create({
                title: $scope.title,
                body: $scope.body
            });
            $scope.title = '';
            $scope.body = '';
        };

        $scope.incrementUpvotes = function(post) {
            posts.upvote(post);
        };
    }
]);

app.controller('PostCtrl',[
    '$scope',
    'posts',
    'post',
    'auth',
    function ($scope, posts, post, auth) {
        $scope.post = post;
        // This is temporary solutions, for fast explanation.
        // We must find best way to implement this logic.
        $scope.posts = post.data;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addComment = function(){
            if($scope.body === '') { return; }
            posts.addComments(post._id, {
                body: $scope.body
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };
        $scope.incrementUpvotes = function(comment) {
            posts.upvoteComment(post, comment);
        };
        $scope.removePosts = function (postId) {
            posts.removePost(postId).then(function (xxx) {
                    posts.getPendingPost().then(function () {
                        $scope.posts = posts.posts;
                    });
                });
        };
        $scope.approvePosts = function (postId) {
            posts.approvePost(postId).then(function (xxx) {
                    posts.getPendingPost().then(function () {
                        $scope.posts = posts.posts;
                    });
                });
        };
        $scope.saveChanges = function (postId) {
            posts.saveChange(postId, {
                title: $scope.post.title,
                body: $scope.post.body
            });

        };
        
    }
]);

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function ($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };

        $scope.login = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };

    }
]);

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isModerator = auth.isModerator;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);