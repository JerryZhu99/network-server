import {
    app
} from "app/app.js";

app.controller("loginController", function ($scope, $http, $location) {
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
        }).then(function (data) {
            console.log(data.data);

            if (!data.data.success) {
                $scope.error = data.data.error;
            } else {
                $scope.$parent.username = data.data.username;
                $location.path('/lobbies')
            }
        });
    };
});