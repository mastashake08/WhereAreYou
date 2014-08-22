

var app = angular.module('myApp', ['google-maps']);
var person = prompt("Please Enter Your Name","SpongeBob");
/*STARTUP STUFF*/
var x = document.getElementById("geo");
var conn = new WebSocket('ws://192.168.0.6:8080');
var img_url;
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
   document.getElementById("p1").innerHTML+="<br>"+e.data;
};


app.run(function($rootScope) {
  $rootScope.name = "Where Are You?";
});

app.controller('MessageController', function($scope) {
  $scope.message = {
    text: null
  };
$scope.geo = {
lat: "0",
lng:"0",
accuracy:"0",
img_url:""
};

/*FUNCTIONS*/
//showPosition
$scope.showPosition = function (position) {
$scope.geo.lat = position.coords.latitude;
$scope.geo.lng = position.coords.longitude;
var latlon = $scope.geo.lat+","+scope.geo.lng;
$scope.geo.img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
document.getElementById("mapholder").innerHTML = "<img src='"+$scope.geo.img_url+"'>";
};


//sendMessage
 $scope.sendMessage = function() {
conn.send($scope.message.text);
};

//sendGeo

$scope.sendGeo = function() {
conn.send("My current location is " + $scope.geo.lat + ", " + $scope.geo.lng);

};

//showError
$scope.showError = function(error) {
switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
}

};

//getGeo
$scope.getGeo = function() {
if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition,$scope.showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

};


});
