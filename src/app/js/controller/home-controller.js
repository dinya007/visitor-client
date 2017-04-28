app.controller('homeController', ['$scope', '$interval', '$rootScope', 'placeService', 'visitorService', function ($scope, $interval, $rootScope, placeService, visitorService) {

    $scope.currentBounds = undefined;
    $scope.selectedPlace = undefined;

    var getAll = function () {
        placeService.getAllInArea(0, 0, 0, 0)
            .then(function (data) {
                var places = data.data;
                console.log(places);
                $scope.currentBounds = undefined;
                $scope.updateMap(places);
            });
    };


    var getAllInArea = function (bounds) {
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
    };

    initMap($scope, [], function () {
        google.maps.event.addListener($scope.map, "bounds_changed", function () {
            $scope.currentBounds = $scope.map.getBounds();
        });
        getAll();
    }, false);

    // $interval(function () {
    //     if ($scope.currentBounds) {
    //         var bounds = $scope.currentBounds;
    //         getAllInArea(bounds);
    //     }
    // }, 3000);


    $scope.setSelectedPlace = function (place) {
        $scope.selectedPlace = place;
    };

    $scope.startVisit = function (visitTime, visitorsAmount) {
        var selectedPlace = $scope.selectedPlace;
        selectedPlace.startTime = Date.now();
        selectedPlace.visitTime = visitTime;
        selectedPlace.visitorsAmount = visitorsAmount;
        delete selectedPlace.marker;

        var visitor = {};
        visitor = $rootScope.visitor;
        if (visitor.places === undefined) {
            visitor.places = [];
        }

        visitor.places.push(selectedPlace);
        visitorService.save(visitor)
            .then(function (data) {
                alert("Вас будут ждать в " + visitTime + "!");
                $rootScope.visitor = data.data;
            });
    };

    $scope.visitTime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 10;


    $scope.toggleMinDate = function () {
        var minDate = new Date();
        var maxDate = new Date();
        minDate.setDate(minDate.getDate());
        maxDate.setDate(maxDate.getDate() + 1);
        $scope.dateOptions.minDate = $scope.dateOptions.minDate ? null : minDate;
        $scope.dateOptions.maxDate = $scope.dateOptions.maxDate ? null : maxDate;
    };

    $scope.dateOptions = {
        showWeeks: false,
        startingDay: 0
    };

    $scope.toggleMinDate();


    $scope.open = function ($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dateOpened = true;
    };

    $scope.dateOpened = false;
    $scope.hourStep = 1;
    $scope.minuteStep = 15;
    $scope.format = "dd-MMM-yyyy HH:mm";
    $scope.minTime = new Date(0, 0, 0, Math.max(1, $scope.visitTime.getHours()), 0, 0, 0);

    $scope.timeOptions = {
        hourStep: [1, 2, 3],
        minuteStep: [1, 5, 10, 15, 25, 30]
    };

}]);
