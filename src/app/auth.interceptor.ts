import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './service/auth.service';
import * as moment from 'moment';
import {environment} from 'src/environments/environment';
import {Color} from '@ionic/core';
import {ToastController, NavController} from '@ionic/angular';
import {EMPTY} from 'rxjs';
import {Network} from '@ionic-native/network/ngx';
import * as Sentry from 'sentry-cordova';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    startDate: string;
    endDate: string;

    constructor(private router: Router,
                private authService: AuthService,
                public toastController: ToastController,
                private network: Network,
                private zone: NgZone,
                private nav: NavController
    ) {
        let hour = 0;
        let minute = 0;
        let second = 0;
        this.startDate = moment().clone().weekday(0).set({hour, minute, second}).format(environment.apiDateFormat);
        hour = 23;
        minute = 59;
        second = 59;
        this.endDate = moment().clone().weekday(6).set({hour, minute, second}).format(environment.apiDateFormat);
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (req.url.includes('/assets/')) {
            return next.handle(req);
        }
        if (req.headers.get('Auth') === 'True') {
            this.connectedToTheInternet();
            const deviceOffline = localStorage.getItem('device-offline');
            if (deviceOffline === 'true') {
                return this.returnCache(req);
            }
            if (this.authService.authenticated()) {
                const token = localStorage.getItem('jwt-token');
                const clonedreq = req.clone({
                    headers: req.headers.set(
                        'Authorization',
                        token
                    )
                });
                return next.handle(clonedreq).pipe(
                    tap(
                        succ => {
                            if (succ.type !== 0) {
                                this.makeCache(succ);
                            }
                        },
                        err => {
                            if (
                                isNotNullOrUndefined(err.error.message) &&
                                err.error.message.includes('Kilometers for agenda item with id') &&
                                err.error.message.includes('not found')
                            ) {
                                console.error(err);
                            } else if (
                                isNotNullOrUndefined(err.error.message) &&
                                err.error.message.includes('No change request found for agenda item id')
                            ) {
                                console.error(err);
                            } else {
                                const tkn = localStorage.getItem('jwt-token');
                                const username = this.authService.getName(tkn);
                                const personnelId = this.authService.getPersonnelId(tkn);
                                const ip_address = this.authService.getIpAddress(tkn);
                                const email = this.authService.getEmail(tkn);
                                Sentry.configureScope(scope => scope.setUser({
                                    id: personnelId,
                                    ip_address,
                                    email,
                                    username
                                }));
                                Sentry.captureException(err.error.message || err);
                            }
                            if (err.status === 401) {
                                this.router.navigateByUrl('/login');
                                return EMPTY;
                            }
                        }
                    )
                );
            } else {
                if ('/menu/login' !== this.router.url && '/login' !== this.router.url) {
                    this.router.navigateByUrl('/login');
                }
                return EMPTY;
            }

            /*if (localStorage.getItem('jwt-token') != null) {
                const clonedreq = req.clone({
                    headers: req.headers.set(
                        'Authorization',
                        token
                    )
                });
                return next.handle(clonedreq).pipe(
                    tap(
                        succ => {
                        },
                        err => {
                            if (err.status === 401) {
                                this.router.navigateByUrl('/menu/login');
                            }
                        }
                  )
                );
            } else {
                this.router.navigateByUrl('/login');
            }*/
        }
        return EMPTY;


    }

    private makeCache(succ) {
        const path: string = isNotNullOrUndefined(succ) ? succ.url : undefined;
        if (isNotNullOrUndefined(path) && !path.includes('customer/name')) {
            if (path.includes('care-worker/me')) {
                localStorage.setItem('cache-care-worker-me', JSON.stringify(succ.body));
            } else if (path.includes(`/agenda-item/from/${this.startDate}/to/${this.endDate}`)) {
                localStorage.setItem('cache-agenda-item', JSON.stringify(succ.body));
            }
        }

    }

    private returnCache(req: HttpRequest<any>) {
        if (req.url.includes('care-worker/me')) {
            const data = JSON.parse(localStorage.getItem('cache-care-worker-me'));
            return of(new HttpResponse({status: 200, body: data}));
        } else if (req.url.includes(`/agenda-item/from/${this.startDate}/to/${this.endDate}`)) {
            if (localStorage.getItem('cache-agenda-item') === null) {
                this.presentToast('Er kunnen geen agenda items uit het geheugen worden gehaald. Het is noodzakelijk om verbinding te maken met het internet.');
                return EMPTY;
            }
            const data = JSON.parse(localStorage.getItem('cache-agenda-item'));
            return of(new HttpResponse({status: 200, body: data}));
        } else {
            return EMPTY;
        }

    }

    async presentToast(message: string, color: Color = 'warning') {
        const toast = await this.toastController.create({
            message,
            color,
            duration: 10000
        });
        toast.present();
    }

    connectedToTheInternet() {
        if (localStorage.getItem('device-offline') === 'false' && this.network.type === 'none') {
            if ('/menu/login' !== this.router.url && '/login' !== this.router.url) {
                this.zone.run(async () => {
                    localStorage.setItem('device-offline', 'true');
                    localStorage.setItem('login-busy', 'true');
                    this.nav.navigateForward('/login');
                });
            }

        } else if (localStorage.getItem('device-offline') === 'true' && this.network.type !== 'none') {
            if ('/menu/login' !== this.router.url && '/login' !== this.router.url) {
                this.zone.run(async () => {
                    localStorage.setItem('device-offline', 'false');
                    localStorage.setItem('login-busy', 'false');
                    this.nav.navigateForward('/login');
                });
            }
        }
    }
}
