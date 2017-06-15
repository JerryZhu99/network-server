import {
    app
} from "app/app.js";

app.controller("loginController", function ($scope, $http, $location, Auth) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: 'login',
            data: $scope.formData,
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            console.log(response.data);

            if (!response.data.success) {
                $scope.error = response.data.error;
            } else {
                $scope.$parent.username = response.data.username;
                Auth.set(response.data.username);
                $location.path('/lobbies')
            }
        });
    };
});