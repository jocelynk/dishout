import {Page} from 'ionic-angular';
import {MapService} from '../../services/MapService';

@Page({

  templateUrl: 'build/pages/map/map.html',
  providers: [MapService]
})
export class Map {
  static get parameters() {
    return [[MapService]];
  }
  constructor(mapService) {
    this.locations = "map";
    this.map = null;
    this.mapService = mapService;
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

  }

  ngOnInit() {
    this.mapService.initalizeMap().subscribe(data => {
        this.map = data;
        console.log(this.map);
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
          var marker = new google.maps.Marker({
            position: this.map.center,
            map: this.map,
            title: 'hello'
          });
        //}

      }
    )

  }

 /* ngAfterViewInit() {

  }*/


  onSegmentChanged(event) {
    if(this.locations == "map") {
      var mapNode = this.map.getDiv();
      document.getElementById("map").appendChild(mapNode);
    }

  }
}
