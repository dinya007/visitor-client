app.controller('homeController', ['$scope', '$interval', 'placeService', function ($scope, $interval, placeService) {

    $scope.currentBounds = undefined;

    initMap($scope, [], function () {
        google.maps.event.addListener($scope.map, "bounds_changed", function () {
            $scope.currentBounds = $scope.map.getBounds();
        });
    }, false);

    $interval(function () {
        if ($scope.currentBounds) {
            var bounds = $scope.currentBounds;
            console.log(bounds);
            var nelat = bounds.getNorthEast().lat();
            var nelng = bounds.getNorthEast().lng();
            var swlat = bounds.getSouthWest().lat();
            var swlng = bounds.getSouthWest().lng();
            placeService.getAllInArea(nelat, swlng, swlat, nelng)
                .then(function (data) {
                    var places = data.data;
                    console.log(places);
                    $scope.currentBounds = undefined;
                    $scope.updateMap(places);
                });
        }
    }, 3000);

}]);
