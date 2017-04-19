app.controller('homeController', ['$scope', function ($scope) {

    initMap(function (setPlaces) {
        setPlaces([]);
    }, $scope);

}]);
