import {Page, NavController} from 'ionic-angular';
import { Router, RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { contentHeaders } from '../../common/headers';
import {TabsPage} from '../../pages/tabs/tabs';
import {AuthService} from '../../services/AuthService';
import { RequestOptions, URLSearchParams } from 'angular2/http';


@Page({
    templateUrl: 'build/pages/login/login.html',
    providers: [AuthService]
})

export class Login {
    static get parameters() {
        return [[NavController], [Router], [Http], [AuthService]];
    }

    constructor(navController, router, http, AuthService) {
        this.router = router;
        this.http = http;
        this.nav = navController;
        this.username = "";
        this.password = "";
        this.auth = AuthService;
        this.tabsPage = TabsPage;
    }

    ngOnInit() {
        if (this.auth.authenticated()) {
            //this.updateProgressBar(this.auth.user.user_points, this.auth.user.points_to_next_level);
            console.log(this.auth.user);
            this.refreshUser();
            //this.nav.rootNav.setRoot(TabsPage);
        }
    }

    login(event, username, password) {
        console.log(event);
        console.log(username);
        this.nav.push(TabsPage);
    }

    updateProgressBar(value, max) {
        var pBar = document.getElementById('pbar');
        if (max) {
            pBar.max = max;
        }

        if (value) {
            pBar.value = value;
        }
    }

    refreshUser(callback, param) {
        let params = new URLSearchParams();
        params.set('email', this.auth.user.email);
        params.set('username', this.auth.user.name);
        let options = new RequestOptions({
            headers: contentHeaders,
            // Have to make a URLSearchParams with a query string
            search: params
        });
        var self = this;

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
                self.nav.rootNav.setRoot(TabsPage);
            }
        );
    }

    /*login(event, username, password) {
     event.preventDefault();
     let body = JSON.stringify({ username, password });
     this.http.post('http://localhost:3001/sessions/create', body, { headers: contentHeaders })
     .subscribe(
     response => {
     localStorage.setItem('jwt', response.json().id_token);
     this.router.parent.navigateByUrl('/home');
     },
     error => {
     alert(error.text());
     console.log(error.text());
     }
     );
     }*/

    signup(event) {
        event.preventDefault();
        this.router.parent.navigateByUrl('/signup');
    }
}