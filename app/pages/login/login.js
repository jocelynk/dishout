import {Page, NavController} from 'ionic-angular';
import { Router, RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { contentHeaders } from '../../common/headers';
import {TabsPage} from '../../pages/tabs/tabs';
import {AuthService} from '../../services/AuthService';

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
        if(this.auth.authenticated()) {
            //this.updateProgressBar(this.auth.user.user_points, this.auth.user.points_to_next_level);
            console.log(this.auth.user);
            this.nav.rootNav.setRoot(TabsPage);
        }
    }

    login(event, username, password) {
        console.log(event);
        console.log(username);
        this.nav.push(TabsPage);
    }

    updateProgressBar(value, max) {
        var pBar = document.getElementById('pbar');
        if(max) {
            pBar.max = max;
        }

        if(value) {
            pBar.value = value;
        }
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