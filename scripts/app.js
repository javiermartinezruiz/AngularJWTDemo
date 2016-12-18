(function(){
  'use strict';

  angular.module('SAJWTDemo',['satellizer'])
  .controller('SAJWTDemoController', SAJWTDemoController)
  .service('SAJWTDemoService', SAJWTDemoService)
  .service('SAJWTAuthService', SAJWTAuthService)
  .config(function ($httpProvider, $authProvider) {

$httpProvider.defaults.headers.common = {}
$httpProvider.defaults.headers.post = {}

        // Parametros de configuración
        $authProvider.loginUrl = "http://localhost:8080/login";
        //$authProvider.signupUrl = "http://api.com/auth/signup";
        $authProvider.tokenName = "token";
        $authProvider.tokenHeader = 'Authorization';
        $authProvider.tokenType = 'Bearer';
        $authProvider.tokenPrefix = "myApp";
        $authProvider.storageType = 'localStorage';
    //    $authProvider.withCredentials = false;

  })
  ;

  SAJWTDemoController.$inject = ['SAJWTDemoService', 'SAJWTAuthService', '$auth']
  function SAJWTDemoController(SAJWTDemoService, SAJWTAuthService, $auth){
    var controller = this;

    controller.users = [];
    controller.publicUsers = [];

    controller.login = function(){
      console.log("Log in...");
      var response = SAJWTAuthService.slogin();
    }

    controller.logout = function(){
      console.log("Log out...");
      var response = SAJWTAuthService.slogout();
    }

    controller.getUsers = function(){
        console.log("Getting users...");
        var promise = SAJWTDemoService.getUsers();
        promise
        .then(function(result){
            console.log(result.data);
            controller.users = result.data;
        })
        .catch(function(error){
          console.log("Error "+error.status+", ");
          console.log(error.data);
        });
    };

    controller.getPublicUsers = function(){
        console.log("Getting public users...");
        var promise = SAJWTDemoService.getPublicUsers();
        promise.then(function(result){
            console.log(result.data);
            controller.publicUsers = result.data;
        });
    };



  };

  SAJWTAuthService.$inject = ['$http', '$auth']
  function SAJWTAuthService($http, $auth){
    var service = this;

    service.slogin = function(){
        var credentials = {
             username: 'jmartinez',
             password: 'jmartinez'
         }

         // Use Satellizer's $auth service to login
         $auth.login(credentials)
         .then(function(data) {

             // If login is successful, redirect to the users state
             //$state.go('users', {});
            // $auth.setToken(data.)
             var header = data.headers()['authorization'];
             $auth.setToken(header);

             console.log(data);
             console.log($auth.getPayload());
             console.log($auth.getToken());

         })
         .catch(function(response){
           console.log(response);
         });
    };

    service.slogout = function(){
      $auth.logout();
    }

  };

  SAJWTDemoService.$inject = ['$http', '$auth']
  function SAJWTDemoService($http, $auth){
    var service = this;
    service.getUsers = function(){
        console.log("Getting user payload...");
        console.log($auth.getPayload());
        console.log($auth.getToken());

        var promise = null;
        if($auth.getToken()!=null){
          promise =  $http.get('http://localhost:8080/users', {
              headers: {'Authorization': $auth.getToken()}
          });
        }else{
          promise =  $http.get('http://localhost:8080/users');
        }
        return promise;
    };

    service.getPublicUsers = function(){


        var promise = $http({
            method:'GET',
            url: 'http://localhost:8080/public'
        });
        return promise;
    };

  };


})();
