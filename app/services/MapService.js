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

                    console.log(latLng);
                    let mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    console.log(document.getElementById("map"));
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

}

