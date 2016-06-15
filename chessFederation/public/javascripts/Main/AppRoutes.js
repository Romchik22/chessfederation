/**
 * Created by sobolrr on 15.06.16.
 */
angular.module('AppRoutes', []).config([
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
        $urlRouterProvider.otherwise('home');
    }
]);