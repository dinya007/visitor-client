function initMap($scope, places, finishCallback, focusFirstPlace) {
    var infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var mapOptions = {
                zoom: 15,
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                zoomControl: true,
                scaleControl: true,
                rotateControl: true
                // https://developers.google.com/maps/documentation/javascript/controls#DisablingDefaults
            };
            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            $scope.markers = [];

            $scope.updateMap(places);
            finishCallback();
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    $scope.updateMap = function (places) {

        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
        }

        var createMarker = function (place) {
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(place.location.lat, place.location.lon),
                animation: google.maps.Animation.DROP,
                title: place.locationName
            });

            if (place.sales !== null) {
                marker.content = '<ul class="list-group">';
                var i = 0;
                while (i < place.sales.length) {
                    var sale = place.sales[i];
                    if (sale.active) {
                        marker.content += '<li class="list-group-item" style="width: 200px">' + sale.description + '</li>';
                    }
                    ++i;
                }
                marker.content += '</ul>';
            }

            google.maps.event.addListener(marker, 'click', function () {
                var contentString = '<div class="info-window">' +
                    '<h3 class="text-center">' + marker.title + '' +
                    '&nbsp;<span class="badge" style="cursor:pointer" data-toggle="modal" data-target="#start-visit-modal">Я иду!</span> </h3>' +
                    '<div class="info-content">' +
                    '<p>' + marker.content + '</p>' +
                    '</div>' +
                    '</div>';
                infoWindow.setContent(contentString);
                infoWindow.open($scope.map, marker);
                $scope.setSelectedPlace(place);
            });

            $scope.markers.push(marker);
            place.marker = marker;
        };

        for (var i = 0; i < places.length; i++) {
            createMarker(places[i]);
        }

        if (!$scope.currentPlace) {
            $scope.currentPlace = places[0];
        }
        if (focusFirstPlace && $scope.currentPlace) {
            google.maps.event.trigger($scope.currentPlace.marker, 'click');
        }
    };

    $scope.openInfoWindow = function (e, place) {
        e.preventDefault();
        $scope.currentPlace = place;
        google.maps.event.trigger(place.marker, 'click');
    };

}