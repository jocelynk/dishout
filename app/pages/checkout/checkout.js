import {NavController, Page} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Receipt} from '../receipt/receipt';

@Page({
  templateUrl: 'build/pages/checkout/checkout.html',
  providers: [AuthService]
})
export class Checkout {
  static get parameters() {
    return [[AuthService], [NavController]];
  }

  constructor(authService, navController) {
    this.auth = authService;
    this.nav = navController;

    //encode user_id into a qr code
    var qr = require('qr-encode');
    var dataURI = qr(auth.user_id, {type: 6, size: 6, level: 'Q'});
  	//var dataURI = qr('1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV', {type: 6, size: 6, level: 'Q'});
    this.qrcode = dataURI;
  }

  receipt(){
    this.nav.push(Receipt);
  }

}
