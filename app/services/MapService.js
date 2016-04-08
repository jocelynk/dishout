import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()
export class MapService{
    static get parameters() {
        return [[Http]];
    }

    constructor(http) {
        this.infoBox = new InfoBox();
    }


    initalizeMap() {
       /* if(window.cordova) {
            return new Observable.create(observer => {
                navigator.geolocation.getCurrentPosition((position) => {
                    var googleMap = plugin.google.maps.Map.getMap(document.getElementById("map"));
                    //angular.element(document.querySelector('#map'))[0]
                    //
                    googleMap.setClickable(false);
                    observer.next(googleMap);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete(googleMap);
                    /!*googleMap.addEventListener(plugin.google.maps.event.MAP_READY, function (map) {
                       /!* map.setOptions({
                            mapType: plugin.google.maps.MapTypeId.ROADMAP,
                            controls: {
                                compass: true,
                                myLocationButton: true
                            },
                            gestures: {
                                scroll: true,
                                tilt: false,
                                rotate: false,
                                zoom: true
                            }
                        });
                        map.setClickable(true);
                        var myLatLng = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                        map.setCenter(myLatLng);
                        map.setZoom(17);*!/

                        observer.next(googleMap);
                        //call complete if you want to close this stream (like a promise)
                        observer.complete(googleMap);
                    });*!/
                },
                (error) => {
                    console.log(error);
                });
            });
        } else {*/

            return new Observable.create(observer => {
                navigator.geolocation.getCurrentPosition(function(position) {
                    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    //console.log(latLng);
                    let mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    //console.log(document.getElementById("map"));
                    var map =  new google.maps.Map(document.getElementById("map"), mapOptions);
                    observer.next(map);
                    //call complete if you want to close this stream (like a promise)
                    observer.complete();
                }, function(err) {
                    console.log(err);
                });
            });

        //}
    }

    addressLookup(location, map, type) {
        var request = {
            'address': location.address
        };

        var geocoder = new google.maps.Geocoder();
        var self = this;
        geocoder.geocode(request, function (results, status) {
            if (results.length) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var iconBase = "./img/";
                    var icon = {
                        url: type == "vendor"? iconBase + 'restaurant.png': iconBase + 'dropoff.png',
                        scaledSize: new google.maps.Size(30, 30)
                    };

                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location,
                        icon: icon
                    });

                    var boxText = document.createElement("div");
                    boxText.className = 'infobox';
                    if(type == 'vendor') {
                        //temporarily hardcoding promotion for demo purposes
                        if(location.vendor_name == "Maru 2") {
                            boxText.innerHTML = "<h4 class='font-white'>" + location.vendor_name
                                + "</h4><p class='font-white'>" + location.address
                                + "</p><p class='font-white'>"
                                + location.phone_number
                                + "</p><h3 class='font-white'>Free miso soup today with use of DishOut!</h3>"
                        } else
                            boxText.innerHTML = "<h4 class='font-white'>" + location.vendor_name + "</h4><p class='font-white'>" + location.address + "</p><p class='font-white'>" + location.phone_number + "</p>";

                    }
                    else
                        boxText.innerHTML = "<h4 class='font-white'>" + location.location_name + "</h4><p class='font-white'>" + location.address + "</p>";

                    var myOptions = {
                        content: boxText
                        ,disableAutoPan: false
                        ,maxWidth: 0
                        ,pixelOffset: new google.maps.Size(-140, 0)
                        ,zIndex: null
                        ,boxStyle: {
                            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat"
                            ,opacity: 0.75
                            ,width: "280px"
                        }
                        ,closeBoxMargin: "10px 2px 2px 2px"
                        ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
                        ,infoBoxClearance: new google.maps.Size(1, 1)
                        ,isHidden: false
                        ,pane: "floatPane"
                        ,enableEventPropagation: false
                    };



                    //self.infoBox.setContent(boxText);
                    google.maps.event.addListener(marker, 'click', function() {
                        self.infoBox.setOptions(myOptions);
                        self.infoBox.open(map, this);
                    });


                    /*google.maps.event.addListener(marker,'click',(function(marker, i) {
                        return function() {
                            boxList[i].open(map, this);
                        }
                    })(marker, i));

                    google.maps.event.addDomListener(boxList[i].content_,'click',(function(marker, i) {
                        return function() {
                            alert('clicked ' + cityList[i][0])
                        }
                    })(marker, i));*/
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            } else {
                alert("Location not found");
            }
        });

    }

}

