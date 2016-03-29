import {Storage, LocalStorage} from 'ionic-angular';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

// Avoid name not found warnings
//declare var Auth0Lock:any;
//var Auth0Lock = null;
var jwtHelper = new JwtHelper();
var lock  = new Auth0Lock('Jnr8067YGg77nYBmsBugJvmp3g93Za9k', 'dishout.auth0.com');
var local = new Storage(LocalStorage);
var refreshSubscription = null;
var user = null;
@Injectable()
export class AuthService {

    static get parameters() {
        return [/*[JwtHelper], [Storage], [LocalStorage], */[AuthHttp]];
    }

    constructor(/*JwtHelper, Storage, LocalStorage, */AuthHttp) {
        this.jwtHelper = jwtHelper;
        this.lock = lock;
        this.local = local;
        this.refreshSubscription = refreshSubscription;
        this.user = user;
        this.authHttp = AuthHttp;
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

    login() {
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
            this.local.set('profile', JSON.stringify(profile));
            this.local.set('id_token', token);
            this.local.set('refresh_token', refreshToken);
            this.user = profile;
            // Schedule a token refresh
            this.scheduleRefresh();
        });
    }

    logout() {
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
}