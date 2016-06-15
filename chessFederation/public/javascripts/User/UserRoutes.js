/**
 * Created by sobolrr on 15.06.16.
 */
angular.module('UserRoutes', []).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('userlist',{
            url: '/userlist',
            templateUrl: '/userlist.html',
            controller: 'UserCtrl',
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
        
        $urlRouterProvider.otherwise('home');
    }
]);