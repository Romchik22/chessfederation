/**
 * Created by sobolrr on 14.06.16.
 */
angular.module('PostService', []).factory('posts', ['$http', 'auth', '$q', function ($http, auth, $q) {
    var post = {
        posts: []
    };
    post.getAll= function () {
        return $http.get('/posts').success(function (data) {
            angular.copy(data, post.posts);
        });
    };
    post.getPendingPost= function () {
        return $http.get('/posts/suggestedposts').success(function (data) {
            angular.copy(data, post.posts);
        });
    };
    post.removePost = function (id) {
        var deferred = $q.defer();
        $http.delete('/posts/suggestedposts/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };
    post.deleteComment = function (postId, commentId) {
        var deferred = $q.defer();
        $http.delete('/posts/' + postId + '/comments/' + commentId).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };

    post.approvePost = function (id) {
        var deferred = $q.defer();
        $http.patch('/posts/suggestedposts/' + id).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.error(err);
        });
        return deferred.promise;
    };

    post.saveChange = function (id, post) {
        return $http.patch('/posts/suggestedposts/edit/' + id, post,
            {headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function (data) {
            // post.posts.push(data);
        });
    };

    post.create = function (post) {
        return $http.post('/posts/addpost', post,
            {headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function (data) {
            post.posts.push(data);
        });
    };
    post.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote', null,
            { headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data) {
            post.upvotes += 1;
        });
    };
    post.get = function(id){
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    post.addComments = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment,{
            headers: {Authorization: 'Bearer '+auth.getToken()}
        });
    };
    post.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function (data) {
            comment.upvotes += 1;
        });
    };

    return post;
}]);