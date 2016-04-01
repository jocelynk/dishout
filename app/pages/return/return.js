import {Page, NavController} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {ConfirmReturn} from '../confirm-return/confirm-return';
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
    return [[AuthService], [NavController]];
  }

  constructor(authService, navController) {
    this.nav = navController;
    this.auth = authService;
  }

  scan() {
    // read dropoff box from scan and insert return info to db
    this.nav.push(ConfirmReturn);
  }
}
