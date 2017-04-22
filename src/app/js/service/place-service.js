app.service('placeService', ['restService', function (restService) {

    this.getAllInArea = function (northLat, northLong, southlat, southLong) {
        return restService.get("/places/" + northLat + "/" + northLong + "/" + southlat + "/" + southLong);
    }

}]);
