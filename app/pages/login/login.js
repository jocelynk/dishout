import {Page, NavController} from 'ionic-angular';
import { Router, RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Http, Headers } from 'angular2/http';
import { contentHeaders } from '../../common/headers';
import {TabsPage} from '../../pages/tabs/tabs';

@Page({
    templateUrl: 'build/pages/login/login.html'
})

export class Login {
    static get parameters() {
        return [[NavController], [Router], [Http]];
    }

    constructor(navController, router, http) {
        this.router = router;
        this.http = http;
        this.nav = navController;
        this.username = "";
        this.password = "";
    }

    login(event, username, password) {
        console.log(event);
        console.log(username);
        this.nav.push(TabsPage);
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