import {Page} from 'ionic-angular';
import {MapService} from '../../services/MapService';
import {Http} from 'angular2/http';
import 'rxjs/operator/map';

@Page({
    templateUrl: 'build/pages/map/map.html',
    providers: [MapService]
})
export class Map {
    static get parameters() {
        return [[MapService], [Http]];
    }

    constructor(mapService, http) {
        this.locations = "map";
        this.map = null;
        this.vendors = null;
        this.droplocations = null;
        this.mapService = mapService;
        this.http = http;
        /*navigator.geolocation.getCurrentPosition(function(position) {
         let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

         console.log(latLng);
         let mapOptions = {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
         }
         //console.log(document.getElementById("map"));
         this.map =  new google.maps.Map(document.getElementById("map"), mapOptions);
         console.log(this.map);
         }, function(err) {
         console.log(err);
         });*/
        //mapService.initalizeMap(this.map);
        this.getVendors();
        this.getDropOffLocations();
    }

    ngOnChanges() {

    }

    ngOnInit() {
        console.log("ngOnInit");
        this.mapService.initalizeMap().subscribe(data => {
                this.map = data;
                //console.log(this.map);

                /*if(window.cordova) {
                 this.map.addMarker({
                 'position': this.map.center,
                 'title': "testing",
                 'snippet': 'testing',
                 'icon': {
                 'url': '../../img/default_icon.png'
                 },
                 'draggable': true,
                 'markerClick': function (marker) {
                 marker.showInfoWindow();
                 event.preventDefault();
                 }
                 }, function (marker) {
                 marker.showInfoWindow();
                 });
                 } else {*/
                var self = this;
                this.vendors.forEach(function (vendor) {
                    var address = vendor.street1 + " " + vendor.city + ", " + vendor.state + " " + vendor.zipcode;

                    var v = {vendor_name: vendor.vendor_name, address: address, phone_number: vendor.phone_number};
                    self.mapService.addressLookup(v, self.map, "vendor");
                })

                this.droplocations.forEach(function (location) {
                    var address = location.street1 + " " + location.city + ", " + location.state + " " + location.zipcode;

                    var l = {location_name: location.location_name, address: address};
                    self.mapService.addressLookup(l, self.map, "location");
                })
                //}

            }
        )

    }

    getVendors() {
        console.log("Getting Vendors");
        this.http.get('http://10.128.1.177:3000/api/vendors')
            .map((responseData) => {
                var vendors = [];
                var jsonObject = responseData.json();
                for (var key in jsonObject) {
                    if (jsonObject.hasOwnProperty(key)) {
                        vendors.push(jsonObject[key]);
                    }
                }
                return vendors;
            })
            .subscribe(
                data => this.vendors = data,
                err => this.logError(err),
            () => console.log(this.vendors)
        )
    }

    getDropOffLocations() {
        console.log("Getting Vendors");
        this.http.get('http://10.128.1.177:3000/api/drop_off_locations')
            .map((responseData) => {
                var droplocations = [];
                var jsonObject = responseData.json();
                for (var key in jsonObject) {
                    if (jsonObject.hasOwnProperty(key)) {
                        droplocations.push(jsonObject[key]);
                    }
                }
                return droplocations;
            })
            .subscribe(
                data => this.droplocations = data,
                err => this.logError(err),
            () => console.log(this.droplocations)
        )
    }


    onSegmentChanged(event) {
        if (this.locations == "map") {
            var mapNode = this.map.getDiv();
            document.getElementById("map").appendChild(mapNode);
        }

    }
}
