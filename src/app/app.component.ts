import {Component, NgZone} from '@angular/core';

import {Platform, NavController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {MessagingService} from './modules/messaging/services/messaging.service';
import {Router} from '@angular/router';

interface NavigatorCordova extends Navigator {
    app: {
        exitApp: () => any; // Or whatever is the type of the exitApp function
    };
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private messagingService: MessagingService,
        private translate: TranslateService,
        private nav: NavController,
        public router: Router,
        private zone: NgZone
    ) {

        localStorage.setItem('login-busy', 'false');

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('nl-NL');
        const userLang = localStorage.getItem('USER_LANGUAGE');
        if (userLang) {
            translate.use(userLang);
        } else {
            const browserLang = translate.getBrowserLang();
            translate.use(browserLang.match(/en-US |nl-NL/) ? browserLang : 'nl-NL');
        }
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.platform.backButton.subscribeWithPriority(10, () => {
            const nvgtr = navigator as NavigatorCordova;
            switch (true) {
                case '/menu/calendar' === this.router.url:
                    return nvgtr.app.exitApp();
                case '/menu/login' === this.router.url || '/login' === this.router.url:
                    return nvgtr.app.exitApp();
                case ['/menu/clients', '/menu/expenses', '/menu/settings', '/menu/team'].indexOf(this.router.url) !== -1:
                    this.router.navigate(['menu', 'calendar']);
                    return;
                default:
                    this.nav.back();
            }
        });


        this.platform.resume.subscribe(() => {
            if ('/menu/login' !== this.router.url && '/login' !== this.router.url) {
                this.zone.run(async () => {
                    localStorage.setItem('login-busy', 'false');
                    this.nav.navigateForward('/login');
                });
            }
        });

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

}
