import {Page} from 'ionic-angular';
import {Profile} from '../profile/profile';
import {Login} from '../login/login';
import {Map} from '../map/map';
import {Checkout} from '../checkout/checkout';
import {Return} from '../return/return';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html',
  config: {
    tabbarPlacement: 'bottom'
  }
})
export class TabsPage {
  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = Profile;
    this.tab2Root = Map;
    this.tab3Root = Checkout;
    this.tab4Root = Return;
  }
}
