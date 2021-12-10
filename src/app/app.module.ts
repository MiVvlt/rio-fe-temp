import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {MSAdal} from '@ionic-native/ms-adal/ngx';
import {MenuPageModule} from './menu/menu.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';

moment.locale('nl-BE');

import {registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeBe from '@angular/common/locales/be';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AuthInterceptor} from './auth.interceptor';

import {FCM} from '@ionic-native/fcm/ngx';

import * as Sentry from '@sentry/browser';

import {Integrations as TracingIntegrations} from '@sentry/tracing';


import {environment} from '../environments/environment';
import {Network} from '@ionic-native/network/ngx';
import {AuthService} from './service/auth.service';
import {Observable} from 'rxjs';


registerLocaleData(localeNl, 'nl');
registerLocaleData(localeNl, 'nl-NL');
registerLocaleData(localeBe, 'nl-BE');

export function momentAdapterFactory() {
    return adapterFactory(moment);
}

export class CustomDateFormatter extends CalendarNativeDateFormatter {
    public dayViewHour({date, locale}: DateFormatterParams): string {
        return new Intl.DateTimeFormat('ca', {
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    }
}

export class TranslateHttpLoader implements TranslateLoader {
    constructor(private http: HttpClient,
                public prefix: string = '/assets/i18n/',
                public suffix: string = '.json') {
    }

    public getTranslation(lang: string): Observable<any> {
        try {
            return this.http.get(`${this.prefix}${lang}${this.suffix}`);
        } catch (err) {
            try {
                return this.http.get(`/assets/www${this.prefix}${lang}${this.suffix}`);
            } catch (e) {
                console.error(err, e);
            }
        }
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


Sentry.init({
    dsn: environment.dsn,
    integrations: [new TracingIntegrations.BrowserTracing()],
    tracesSampleRate: 1.0,
} as any);

export class SentryIonicErrorHandler implements ErrorHandler {

    constructor(private authService: AuthService) {
    }

    async handleError(err: any): Promise<void> {
        console.error(err);
        if (err instanceof Error) {
            if (!err.message.startsWith('Uncaught (in promise): HttpErrorResponse:')) {
                this.sendToSentry(err);
            }
        } else if (!(err instanceof HttpErrorResponse)) {
            this.sendToSentry(err);
        }
    }

    private sendToSentry(err: any) {
        const token = localStorage.getItem('jwt-token');
        const username = this.authService.getName(token);
        const id = this.authService.getPersonnelId(token);
        const ip_address = this.authService.getIpAddress(token);
        const email = this.authService.getEmail(token);


        try {
            Sentry.configureScope(scope => scope.setUser({
                id,
                ip_address,
                email,
                username
            }));
            Sentry.captureException(err.originalError || err);
        } catch (e) {
            console.error(e);
        }
    }
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        MenuPageModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: momentAdapterFactory
        }, {
            dateFormatter: {
                provide: CalendarDateFormatter,
                useClass: CustomDateFormatter
            }
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        // {provide: ErrorHandler, useClass: MyErrorHandler},
        {provide: ErrorHandler, useClass: SentryIonicErrorHandler},
        StatusBar,
        SplashScreen,
        {provide: LOCALE_ID, useValue: 'nl'},
        MSAdal,
        FCM,
        Network,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
