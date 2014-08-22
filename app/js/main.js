

var app = angular.module('myApp', []);
var person = prompt("Please Enter A Username","SpongeBob");
/*STARTUP STUFF*/
var x = document.getElementById("geo");
var conn = new WebSocket('ws://54.201.124.156:8080');
var img_url;
conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
	console.log(e.data);
	img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+e.data+"&zoom=14&size=400x300&sensor=false";
   document.getElementById("incoming_messages").innerHTML+="<br>"+e.data+"<img src="+img_url+">"+"<br>";
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
var latlon = $scope.geo.lat+","+$scope.geo.lng;
$scope.geo.img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
};


//sendMessage
 $scope.sendMessage = function() {
conn.send(person + ": "+ $scope.message.text);
document.getElementById("incoming_messages").innerHTML+="<br>"+person+": "+$scope.message.text;
};

//sendGeo

$scope.sendGeo = function() {
conn.send($scope.geo.lat + "," + $scope.geo.lng);
document.getElementById("incoming_messages").innerHTML+="<br>"+$scope.geo.lat + ", " + $scope.geo.lng+ "<img src="+$scope.geo.img_url+">" ;

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
        navigator.geolocation.getCurrentPosition($scope.showPosition,$scope.showError,{enableHighAccuracy:true});
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

};


});
