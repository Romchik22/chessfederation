/**
 * Created by sobolrr on 15.06.16.
 */
angular.module('NavCtrl', []).controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isModerator = auth.isModerator;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);