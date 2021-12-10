import {Component, OnInit} from '@angular/core';
import {AuthenticationContext, AuthenticationResult, MSAdal} from '@ionic-native/ms-adal/ngx';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import * as Sentry from 'sentry-cordova';

declare var Microsoft: any;
import {Network} from '@ionic-native/network/ngx';
import {Color} from '@ionic/core';

import {LoadingController, Platform, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    message: string;
    token: string;
    user: {
        givenName: string;
        familyName: string;
        personnelId: string;
        id: string;
    };
    retry: boolean;


    constructor(private plt: Platform, private msAdal: MSAdal, public loadingController: LoadingController, private router: Router, private authService: AuthService, private network: Network, public toastController: ToastController) {
        if (this.connectedToTheInternet()) {
            localStorage.setItem('device-offline', 'false');
            console.log('Device is connected to the internet');
        } else {
            this.presentToast('Er is geen verbinding met het internet, hierdoor is er een beperkte functionaliteit.');
            localStorage.setItem('device-offline', 'true');
            authService.logout();
            console.log('Device not connected to the internet');
        }
        if (authService.authenticated()) {
            this.router.navigate(['/menu/calendar']);
        } else if (localStorage.getItem('login-busy') === 'false') {
            this.message = 'aanmelden starten...';
            this.login();
        } else {
            this.message = 'aanmelden al bezig, probeer opnieuw indien nodig...';
            this.retry = true;
        }
    }

    async login() {
        console.log('login started');
        localStorage.setItem('login-busy', 'true');
        // tslint:disable-next-line:max-line-length
        await this.plt.ready();
        const loader = await this.presentLoading();

        Microsoft.ADAL.AuthenticationSettings.setUseBroker(true);
        const authContext: AuthenticationContext = this.msAdal.createAuthenticationContext(environment.endpointUrl);

        authContext.acquireTokenSilentAsync(environment.azureAdClientId, environment.azureAdClientId, '')
            .then((authResponse: AuthenticationResult) => {
                this.token = authResponse.accessToken;
                if (this.token) {
                    localStorage.setItem('jwt-token', 'Bearer ' + this.token);
                    this.user = {
                        givenName: authResponse.userInfo.givenName,
                        familyName: authResponse.userInfo.familyName,
                        personnelId: authResponse.userInfo.uniqueId,
                        id: ''
                }
                    ;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    localStorage.setItem('login-busy', 'false');
                }
                loader.dismiss();
                this.navigateToCalendar();
            })
            .catch((e: any) => {
                Sentry.captureMessage('error message in 1st catch : ' + e.toString());
                authContext.acquireTokenAsync(environment.azureAdClientId, environment.azureAdClientId, environment.redirectUri, '', '')
                    .then((authResponse: AuthenticationResult) => {
                        this.token = authResponse.accessToken;
                        if (this.token) {
                            localStorage.setItem('jwt-token', 'Bearer ' + this.token);
                            this.user = {
                                givenName: authResponse.userInfo.givenName,
                                familyName: authResponse.userInfo.familyName,
                                personnelId: authResponse.userInfo.uniqueId,
                                id: ''
                            };
                            localStorage.setItem('user', JSON.stringify(this.user));
                            localStorage.setItem('login-busy', 'false');
                        }
                        loader.dismiss();
                        this.navigateToCalendar();
                    })
                    .catch((err: any) => {
                        this.message = err.toString();
                        this.retry = true;
                        Sentry.captureMessage(this.message);
                        Sentry.captureException(err);
                    });
            });

    }


    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 2000
        });
        await loading.present();

        return loading;
    }

    connectedToTheInternet(): boolean {
        return this.network.type !== 'none';
    }

    async presentToast(message: string, color: Color = 'warning') {
        const toast = await this.toastController.create({
            message,
            color,
            duration: 10000
        });
        toast.present();
    }

    ngOnInit() {

    }

    navigateToCalendar() {
        this.router.navigateByUrl('/menu/calendar');
    }
}
