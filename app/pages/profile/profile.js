import {NavController, Page} from 'ionic-angular';
import {AuthService} from '../../services/AuthService';
import {Login} from '../login/login';
import { Http, RequestOptions, URLSearchParams, Headers } from 'angular2/http';
import {contentHeaders} from '../../common/headers';
import {CityPage} from '../../pages/city/city';


@Page({
    templateUrl: 'build/pages/profile/profile.html',
    providers: [AuthService]
})
export class Profile {
    static get parameters() {
        return [[AuthService], [NavController], [Http]];
    }

    constructor(authService, navController, http) {
        this.auth = authService;
        this.nav = navController;
        this.login = Login;
        this.http = http;
    }

    refreshUser() {
        let params = new URLSearchParams();
        params.set('email', this.auth.user.email);
        params.set('username', this.auth.user.name);
        let options = new RequestOptions({
            headers: contentHeaders,
            // Have to make a URLSearchParams with a query string
            search: params
        });

        this.http.get('http://dishout-backend.herokuapp.com/api/user', options)
            .map(res => res.json())
            .subscribe(
                data => {
                console.log(data);
                this.auth.user['user_points'] = data[0]['userpoints'];
                this.auth.user['level_no'] = data[0]['level_no'];
                this.auth.user['level_name'] = data[0]['level_name'];
                this.auth.user['points_to_next_level'] = data[0]['points_to_next_level'];
                this.auth.user['cur_transaction'] = data[0]['cur_transaction'];
            },
                err => console.log(err),
            () => {
                console.log(this.auth.user);
                this.auth.local.set('profile', JSON.stringify(this.auth.user));
            }
        );
    }

    navToMap() {
        this.nav.push(CityPage);
    }
}
