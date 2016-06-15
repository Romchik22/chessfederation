/**
 * Created by sobolrr on 15.06.16.
 */
angular.module('PostRoutes', []).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        
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
        $stateProvider.state('addpost', {
            url: '/addpost',
            templateUrl: '/addpost.html',
            controller: 'MainCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
            }]
        });
        
        $urlRouterProvider.otherwise('home');
    }
]);