import {Page, NavController} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {ConfirmReturn} from '../confirm-return/confirm-return';
import {Http, Headers} from 'angular2/http';

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
    return [[AuthService], [NavController], [Http]];
  }

  constructor(authService, navController, http) {
    this.nav = navController;
    this.auth = authService;
    this.http = http;
  }

  scan() {
    // TODO: get drop off box id from scan
    var today = new Date();
    var body = {'user_id': '1', 'check_out_date': today, 'drop_off_location_id': '1'};
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:3000/api/checkoutdish', JSON.stringify(body), {headers: headers})
    .map(res => res.json())
    .subscribe(
      data => {
        console.log(data);
      },
      err => this.logError(err),
      () => {
        this.nav.push(ConfirmReturn);
      }
    );
  }
}
