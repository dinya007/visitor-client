app.service('visitorService', ['restService', function (restService) {

    this.save = function (visitor){
        return restService.post("/visitor", visitor);
    }

    this.get = function (uid){
        return restService.get("/visitor/" + uid);
    }

}]);