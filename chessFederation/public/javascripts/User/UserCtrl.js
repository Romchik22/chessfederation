/**
 * Created by sobolrr on 14.06.16.
 */
angular.module('UserCtrl', []).controller('UserCtrl', [
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