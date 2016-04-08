import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the ReceiptPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/receipt/receipt.html',
})
export class Receipt{
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }

  goback(){
    this.nav.pop();
    //this.nav.push(TabsPage);
  }
}
