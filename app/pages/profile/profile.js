import {NavController, Page} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Login} from '../login/login';



@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [AuthService]
})
export class Profile {
  static get parameters() {
    return [[AuthService], [NavController]];
  }

  constructor(authService, navController) {
    this.auth = authService;
    this.nav = navController;
    this.login = Login;
  }
}
