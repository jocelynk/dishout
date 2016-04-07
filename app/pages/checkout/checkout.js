import {NavController, Page} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Receipt} from '../receipt/receipt';
import {Http, Headers} from 'angular2/http';

@Page({
  templateUrl: 'build/pages/checkout/checkout.html',
  providers: [AuthService]
})
export class Checkout {
  static get parameters() {
    return [[AuthService], [NavController], [Http]];
  }

  constructor(authService, navController, http) {
    this.auth = authService;
    this.nav = navController;
    this.http = http;

    //encode user_id into a qr code
    var qr = require('qr-encode');
    var dataURI = qr(auth.user_id, {type: 6, size: 6, level: 'Q'});
  	//var dataURI = qr('1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV', {type: 6, size: 6, level: 'Q'});
    this.qrcode = dataURI;
  }

  receipt(){
    //TODO: this part should be done on the vendor-facing interface...
    var today = new Date();
    var body = {'user_id': '1', 'check_in_date': today, 'dish_number': '1', 'vendor_id': '1'};
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
  }
}
