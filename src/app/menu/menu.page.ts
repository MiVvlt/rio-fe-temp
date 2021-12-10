import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {CareWorkerService} from '../service/care-worker.service';
import {MessagingService} from '../modules/messaging/services/messaging.service';

export class ChangeNotification {
    constructor(public oldDate: { from: Date, to: Date },
                public newDate: { from: Date, to: Date },
                public customer: string,
                public type: 'CARE' | 'MEDICAL',
                public id: string | number) {
    }

    get oldDateString(): string {
        return moment(this.oldDate.from).format('dddd DD.MM.YYYY HH:mm - ') + moment(this.oldDate.to).format('HH:mm');
    }

    get newDateString(): string {
        return moment(this.newDate.from).format('dddd DD.MM.YYYY HH:mm - ') + moment(this.newDate.to).format('HH:mm');
    }

    public async getHeader(translateService: TranslateService) {
        return `${(await translateService.get('CHANGE_NOTIFICATION.TYPE.' + this.type)
            .toPromise())} ${(await translateService.get('CHANGE_NOTIFICATION.WITH').toPromise())} ${this.customer}`;
    }
}


@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    user = null;
    pages = [
        {
            title: 'MENU.AGENDA',
            url: '/menu/calendar',
            icon: 'calendar',
            visible: true
        },
        {
            title: 'MENU.CLIENT_AGENDA',
            url: '/menu/clients',
            icon: 'person',
            visible: localStorage.getItem('device-offline') === 'false'
        },
        {
            title: 'MENU.EXPENSES',
            url: '/menu/expenses',
            icon: 'cash',
            visible:  localStorage.getItem('device-offline') === 'false'
        },
        //   {
        //       title: 'MENU.TEAM_AGENDA',
        //       url: '/menu/team',
        //       icon: 'people'
        //   },
        {
            title: 'MENU.SETTINGS',
            url: '/menu/settings',
            icon: 'cog',
            visible: true
        }
    ];

    public permanenceNumber: string;
    public itNumber = '080014890';
    public emergencyNumber = '112';
    public name: string;

    constructor(
        public actionSheetController: ActionSheetController,
        public translateService: TranslateService,
        public alertController: AlertController,
        public toastController: ToastController,
        public authService: AuthService,
        public router: Router,
        private callNumber: CallNumber,
        private careWorkerService: CareWorkerService,
        public messagingService: MessagingService
    ) {
    }

    async ngOnInit() {

        this.user = JSON.parse(await localStorage.getItem('user'));
        this.permanenceNumber = await localStorage.getItem('PERMANENCE_NUMBER');
        this.name = await localStorage.getItem('NAME');
        if (this.name === null || this.name === undefined) {
            this.careWorkerService.getCareWorkerMe().then(result => {
                this.name = result.name;
                localStorage.setItem('NAME', this.name);
                localStorage.setItem('userId', result.id);
            });
        }

        if (this.user) {
            this.messagingService.initialize();
        } else if (!this.authService.authenticated()){
            this.router.navigate(['/login']);
        }
    }

    public logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    async showChangeNotification(message: ChangeNotification) {
        const alert = await this.alertController.create({
            header: await this.translateService.get('CHANGE_NOTIFICATION.LABEL').toPromise(),
            subHeader: await message.getHeader(this.translateService),
            message: `
                 <div class="striketrough">
                    ${await this.translateService.get('CHANGE_NOTIFICATION.OLD').toPromise()}: ${await message.oldDateString}
                </div>
                 <div>${await this.translateService.get('CHANGE_NOTIFICATION.NEW').toPromise()}: ${await message.newDateString}</div>`,
            buttons: [
                {
                    text: await this.translateService.get('CHANGE_NOTIFICATION.SHOW').toPromise(),
                    handler: () => {
                        this.router.navigate(['/menu/calendar/' + message.id]);
                    }
                },
                {
                    text: await this.translateService.get('CHANGE_NOTIFICATION.DISMISS').toPromise(),
                    role: 'cancel'
                }
            ]
        });

        await alert.present();
    }

    async showHelpMenu(ev: any) {
        const actionSheet = await this.actionSheetController.create({
            header: await this.translateService.get('MENU.HELP').toPromise(),
            buttons: [{
                text: await this.translateService.get('HELP_MENU.PERMANENCE').toPromise(),
                icon: 'call',
                cssClass: 'helpMenuItem',
                handler: async () => {
                    this.permanenceNumber = localStorage.getItem('PERMANENCE_NUMBER');
                    if (this.permanenceNumber) {
                        this.callNumber.callNumber(this.permanenceNumber, true);
                    } else {
                        const toast = await this.toastController.create({
                            message: 'Nog geen permanentie nummer beschikbaar, ga naar instellingen om deze nummer aan te passen',
                            color: 'primary',
                            duration: 2000
                        });
                        toast.present();
                    }
                }
            }, {
                text: await this.translateService.get('HELP_MENU.IT').toPromise(),
                icon: 'call',
                cssClass: 'helpMenuItem',
                handler: () => {
                    this.callNumber.callNumber(this.itNumber, true);
                }
            }, {
                text: await this.translateService.get('HELP_MENU.EMERGENCY_SERVICES').toPromise(),
                icon: 'call',
                cssClass: 'helpMenuItem',
                handler: () => {
                    this.callNumber.callNumber(this.emergencyNumber, true);
                }
            }, {
                text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }


}
