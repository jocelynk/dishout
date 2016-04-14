import {Storage, LocalStorage} from 'ionic-angular';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import { Http, RequestOptions, URLSearchParams, Headers } from 'angular2/http';
import {contentHeaders} from '../common/headers'



// Avoid name not found warnings
//declare var Auth0Lock:any;
//var Auth0Lock = null;
var jwtHelper = new JwtHelper();
var lock = new Auth0Lock('Jnr8067YGg77nYBmsBugJvmp3g93Za9k', 'dishout.auth0.com');
var local = new Storage(LocalStorage);
var refreshSubscription = null;
var user = null;
@Injectable()
export class AuthService {

    static get parameters() {
        return [[AuthHttp], [Http]];
    }

    constructor(AuthHttp, http) {
        this.jwtHelper = jwtHelper;
        this.lock = lock;
        this.local = local;
        this.refreshSubscription = refreshSubscription;
        this.user = user;
        this.authHttp = AuthHttp;
        this.http = http;
        // If there is a profile saved in local storage
        let profile = this.local.get('profile')._result;
        if (profile) {
            this.user = JSON.parse(profile);
        }
    }

    authenticated() {
        // Check if there's an unexpired JWT
        return tokenNotExpired();
    }

    getUser(profile, nav, page) {
        var createdDate = new Date(profile.created_at).getTime();
        var timeDifference = Math.abs(new Date().valueOf() - createdDate) / (1000);
        console.log(timeDifference);
        var isNewUser = timeDifference < 20 ? true : false;

        var body = {'email': profile.email, 'username': profile.name};
        if (isNewUser) {
            console.log(isNewUser);
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post('http://dishout-backend.herokuapp.com/api/user', JSON.stringify(body), {headers: headers})
                .map(res => res.json())
                .subscribe(
                    data => {
                    console.log(data[0]);
                    this.user['user_points'] = data[0]['userpoints'];
                    this.user['level_no'] = data[0]['level_no'];
                    this.user['level_name'] = data[0]['level_name'];
                    this.user['points_to_next_level'] = data[0]['points_to_next_level'];
                    this.user['cur_transaction'] = data[0]['cur_transaction'];
                },
                    err => console.log(err),
                () => {
                    console.log('Authentication Complete');
                    console.log(this.user);
                    this.local.set('profile', JSON.stringify(this.user));
                    nav.rootNav.setRoot(page);
                    window.location.reload();
                }
            );
        } else {

            let params = new URLSearchParams();
            params.set('email', profile.email);
            params.set('username', profile.name);
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
                    this.user['user_points'] = data[0]['userpoints'];
                    this.user['level_no'] = data[0]['level_no'];
                    this.user['level_name'] = data[0]['level_name'];
                    this.user['points_to_next_level'] = data[0]['points_to_next_level'];
                    this.user['cur_transaction'] = data[0]['cur_transaction'];
                },
                    err => console.log(err),
                () => {
                    console.log('Authentication Complete');
                    console.log(this.user);
                    this.local.set('profile', JSON.stringify(this.user));
                    nav.rootNav.setRoot(page);
                    window.location.reload();
                }
            );
        }

    }


    login(nav, page) {
        // Show the Auth0 Lock widget
        this.lock.show({
            authParams: {
                scope: 'openid offline_access',
                device: 'Mobile device'
            }
        }, (err, profile, token, accessToken, state, refreshToken) => {
            if (err) {
                alert(err);
            }
            // If authentication is successful, save the items
            // in local storage

            this.user = profile;
            this.getUser(profile, nav, page);
            this.local.set('profile', JSON.stringify(profile));
            this.local.set('id_token', token);
            this.local.set('refresh_token', refreshToken);
            // Schedule a token refresh
            this.scheduleRefresh();
        });
    }

    logout(nav, page) {
        nav.rootNav.setRoot(page);
        this.local.remove('profile');
        this.local.remove('id_token');
        this.local.remove('refresh_token');
        this.user = null;
        // Unschedule the token refresh
        this.unscheduleRefresh();
    }

    scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        let source = this.authHttp.tokenStream.flatMap(
                token => {
                // The delay to generate in this case is the difference
                // between the expiry time and the issued at time
                let jwtIat = this.jwtHelper.decodeToken(token).iat;
                let jwtExp = this.jwtHelper.decodeToken(token).exp;
                let iat = new Date(0);
                let exp = new Date(0);

                let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

                return Observable.interval(delay);
            });

        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt();
        });
    }

    startupTokenRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (this.authenticated()) {
            let source = this.authHttp.tokenStream.flatMap(
                    token => {
                    // Get the expiry time to generate
                    // a delay in milliseconds
                    let now = new Date().valueOf();
                    let jwtExp = this.jwtHelper.decodeToken(token).exp;
                    let exp = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    let delay = exp.valueOf() - now;

                    // Use the delay in a timer to
                    // run the refresh at the proper time
                    return Observable.timer(delay);
                });

            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(() => {
                this.getNewJwt();
                this.scheduleRefresh();
            });
        }
    }

    unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }


    getNewJwt() {
        // Get a new JWT from Auth0 using the refresh token saved
        // in local storage
        let refreshToken = this.local.get('refresh_token')._result;
        this.lock.getClient().refreshToken(refreshToken, (err, delegationRequest) => {
            if (err) {
                alert(err);
            }
            this.local.set('id_token', delegationRequest.id_token);
        });
    }

    refreshUser(user) {
        let params = new URLSearchParams();
        params.set('email', user.email);
        params.set('username', user.name);
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
                user['user_points'] = data[0]['userpoints'];
                user['level_no'] = data[0]['level_no'];
                user['level_name'] = data[0]['level_name'];
                user['points_to_next_level'] = data[0]['points_to_next_level'];
                user['cur_transaction'] = data[0]['cur_transaction'];
            },
                err => console.log(err),
            () => {
                console.log(user);
                this.local.set('profile', JSON.stringify(user));
            }
        );
    }


}