import {Component, OnInit} from '@angular/core';
import {MenuController, PopoverController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Globalization} from '@ionic-native/globalization/ngx';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    currentLanguage: string;
    permanenceNumber: string;


    constructor(private menu: MenuController,
                private popoverController: PopoverController,
                private translate: TranslateService,
                private globalization: Globalization,
                private toast: ToastController) {
    }

    async ngOnInit() {
        this.permanenceNumber = localStorage.getItem('PERMANENCE_NUMBER');
        try {
            this.currentLanguage = (await this.globalization.getPreferredLanguage()).value;
            if (this.currentLanguage.substr(0, 2) === 'en') {
                this.currentLanguage = 'en-US';
            }
        } catch (err) {
            this.currentLanguage = 'nl-NL';
        }
    }

    showMenu() {
        this.menu.open();
    }

    async saveSettings() {
        this.translate.use(this.currentLanguage);
        try {
            await localStorage.setItem('PERMANENCE_NUMBER', this.permanenceNumber);
            await localStorage.setItem('USER_LANGUAGE', this.currentLanguage);
        } catch (err) {
            console.log(err);
        }
        this.showSavedSuccess();
    }

    async showSavedSuccess() {
        const toast = await this.toast.create({
            message: await this.translate.get('SETTINGS_PAGE.SUCCESSFULLY_SAVED').toPromise(),
            color: 'primary',
            duration: 2000
        });
        toast.present();
    }

}
