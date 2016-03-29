import {App, Platform} from 'ionic-angular';
import {TabsPage} from './pages/tabs/tabs';
import {provide} from 'angular2/core';
import {Http} from 'angular2/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {Login} from './pages/login/login';
import {Type} from 'angular2/core';
import {AuthService} from './services/AuthService';

import 'rxjs/Rx';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    AuthService,
    provide(AuthHttp, {
          useFactory: (http) => {
            return new AuthHttp(new AuthConfig(), http);
          },
          deps: [Http]
      })
  ]
})
export class MyApp {
  static get parameters() {
    return [[Platform], [AuthService]];
  }

  constructor(platform, AuthService) {
    this.rootPage = Login;
    this.auth = AuthService;
    //this.rootPage = TabsPage;

    platform.ready().then(() => {
      this.auth.startupTokenRefresh();
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }
}
