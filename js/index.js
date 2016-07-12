/**
 *  Used to perform http get request to fetch the json from get_tweets url.
 */

var app = angular.module('twitterApp', []);
app.controller('mainController', function($scope, $http) {
    $http.get("/account")
    .then(function(response) {
        $scope.tweets = response.data;
    });
});
