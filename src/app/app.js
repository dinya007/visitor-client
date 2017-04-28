var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'xeditable',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: 'app/view/home.html'
        })
        .otherwise({redirectTo: '/'});
}]);

app.run(['$rootScope', '$cookies', 'visitorService', function ($rootScope, $cookies, visitorService) {
    var restaurantUid = $cookies.get('restaurant_uid');
    if (restaurantUid !== undefined) {
        visitorService.get(restaurantUid).then(function (data) {
            $rootScope.visitor = data.data;
        });
    } else {
        $rootScope.visitor = {};
    }
}]);

