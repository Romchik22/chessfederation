/**
 * Created by sobolrr on 14.06.16.
 */
angular.module('PostCtrl', []).controller('PostCtrl',[
    '$scope',
    'posts',
    'post',
    'auth',
    function ($scope, posts, post, auth) {
        $scope.post = post;
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
        $scope.deleteComments = function (postId, commentId) {
            posts.deleteComment(postId, commentId).then(function (xxx) {

                $scope.posts = ххх;

            });
        };
    }
]);