/**
 * Created by sobolrr on 14.06.16.
 */
angular.module('chessFederation', []).factory('users',['$http', 'auth', '$q', function ($http, auth, $q) {
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