import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Scanvendor} from '../scanvendor/scanvendor';

@Page({
  templateUrl: 'build/pages/checkout/checkout.html',
  providers: [AuthService]
})
export class Checkout {
  static get parameters() {
    return [[AuthService], [Platform], [NavController]];
  }

  constructor(authService, platform, navController) {
    this.auth = authService;
    this.nav = navController;
    this.platform = platform;

    //encode user_id into a qr code
    //var qr = require('qr-encode');
    //var dataURI = qr(auth.user_id, {type: 6, size: 6, level: 'Q'});
  	//var dataURI = qr('1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV', {type: 6, size: 6, level: 'Q'});
    //this.qrcode = dataURI;
  }

  scan(){
    this.platform.ready().then(() => {
      cordova.plugins.barcodeScanner.scan((result) => {
        var dishid = result.text;
        // Note: hardcoded dish_number and user_id
        this.nav.push(Scanvendor, {user_id: '1', dish_number: '1'});
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
