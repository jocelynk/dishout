import {Page, NavController} from 'ionic-angular';
/*
  Generated class for the ConfirmReturnPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/confirm-return/confirm-return.html',
})
export class ConfirmReturn {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }

  goback(nav){
    this.nav.pop();
  }
}
