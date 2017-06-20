import app from "app/app";
import "app/maincontroller";
import "app/homecontroller";
import "app/lobbycontroller";
import "app/lobbiescontroller";
import "app/gamecontroller";
import "app/inventorycontroller";
import "app/logincontroller";
import "app/registercontroller";

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
      controller: 'homeController',
      templateUrl: 'views/home.html',
    })
    .when('/lobbies', {
      controller: 'lobbiesController',
      templateUrl: 'views/lobbies.html',
    })
    .when('/lobby', {
      controller: 'lobbyController',
      templateUrl: 'views/lobby.html',
    })
    .when('/game', {
      controller: 'gameController',
      templateUrl: 'views/game.html',
    })   
    .when('/outcome', {
      templateUrl: 'views/outcome.html',
    })    
    .when('/inventory', {
      controller: 'inventoryController',
      templateUrl: 'views/inventory.html',
    })
    .when('/login', {
      controller: 'loginController',
      templateUrl: 'views/login.html',
    })
    .when('/register', {
      controller: 'registerController',
      templateUrl: 'views/register.html',
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