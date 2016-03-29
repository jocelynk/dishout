import {Page} from 'ionic-angular';
import {Profile} from '../profile/profile';
import {Login} from '../login/login';
import {Map} from '../map/map';
import {Page3} from '../page3/page3';


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
    this.tab3Root = Page3;
  }
}
