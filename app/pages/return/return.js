import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Scandropoff} from '../scandropoff/scandropoff';

/*
  Generated class for the ReturnPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/return/return.html',
  providers: [AuthService]
})
export class Return {
  static get parameters() {
    return [[AuthService], [Platform], [NavController]];
  }

  constructor(authService, platform, navController) {
    this.nav = navController;
    this.platform = platform;
    this.auth = authService;
  }

  scan() {
    // TODO: get drop off box id from scan   
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        /*
        this.nav.present(Alert.create({
          title: "Scan Results",
          subTitle: result.text,
          buttons: ["Close"]
        }));
        */

        var dishid = result.text;
        // Note: hardcoded dish_number and user_id
        this.nav.push(Scandropoff, {dish_number: '1', user_id: '1'});
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
