import {
  app
} from "app/app.js";
import "app/maincontroller.js";
import "app/homecontroller.js";
import "app/lobbycontroller.js";
import "app/lobbiescontroller.js";
import "app/gamecontroller.js";
import "app/logincontroller.js";
import "app/registercontroller.js";

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
      controller: 'homeController',
      templateUrl: 'files/views/home.html',
    })
    .when('/lobbies', {
      controller: 'lobbiesController',
      templateUrl: 'files/views/lobbies.html',
    })
    .when('/lobby', {
      controller: 'lobbyController',
      templateUrl: 'files/views/lobby.html',
    })
    .when('/game', {
      controller: 'gameController',
      templateUrl: 'files/views/game.html',
    })
    .when('/login', {
      controller: 'loginController',
      templateUrl: 'files/views/login.html',
    })
    .when('/register', {
      controller: 'registerController',
      templateUrl: 'files/views/register.html',
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});
app.factory('Auth', ['$cookieStore', function ($cookieStore) {

  var _user = $cookieStore.get('current.user');

  return {

    user: _user,

    set: function (_user) {
      // you can retrive a user setted from another page, like login sucessful page.
      var existing_cookie_user = $cookieStore.get('current.user');
      _user = _user || existing_cookie_user;
      this.user = _user;
      $cookieStore.put('current.user', _user);
    },

    remove: function () {
      _user = undefined;
      this.user = _user;
      $cookieStore.remove('current.user', _user);
    }
  };
}]);//https://stackoverflow.com/a/17983610