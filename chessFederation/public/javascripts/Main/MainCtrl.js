/**
 * Created by sobolrr on 15.06.16.
 */
angular.module('MainCtrl', []).controller('MainCtrl', [
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