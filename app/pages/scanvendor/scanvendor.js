import {Page, Platform, Alert, NavController, NavParams} from 'ionic-angular';
import {Receipt} from '../receipt/receipt';
import {Http, Headers} from 'angular2/http';

/*
  Generated class for the ScanvendorPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/scanvendor/scanvendor.html',
})
export class Scanvendor {
  static get parameters() {
    return [[NavController], [NavParams], [Http], [Platform]];
  }

  constructor(nav, navParams, http, platform) {
    this.nav = nav;
    this.http = http;
    this.platform = platform;
    this.user_id = navParams.get('user_id');
    this.dish_number = navParams.get('dish_number');
  }

  scan() {
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        var today = new Date();
        var vendor_id = result.text;

        //Note: hardcoded vendor_id
        var body = {'user_id': this.user_id, 'check_in_date': today, 'dish_number': this.dish_number, 'vendor_id': '1'};
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('http://localhost:3000/api/checkindish', JSON.stringify(body), {headers: headers})
        .map(res => res.json())
        .subscribe(
          data => {
            console.log(data);
          },
          err => this.logError(err),
          () => {
            this.nav.push(Receipt);
          }
        );
      }, (error) => {
        this.nav.present(Alert.create({
          title: "Attention!",
          subTitle: error,
          buttons: ["Close"]
        }));
      });
    });

  }
}
