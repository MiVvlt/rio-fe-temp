import {Component, OnChanges, OnInit} from '@angular/core';
import {AlertController, LoadingController, MenuController, ModalController, ToastController} from '@ionic/angular';
import {ClientsService} from '../service/clients.service';
import {Client} from '../interface/Client';
import {SessionEvent} from '../interface/SessionEvent';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CommunicateAllModalComponent} from '../components/communicate-all-modal/communicate-all-modal.component';
import {CalendarService} from '../service/calendar.service';
import {Color} from '@ionic/core';
import {environment} from '../../environments/environment';
import {NetworkService} from '../service/network.service';
import {Network} from '@ionic-native/network/ngx';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.page.html',
    styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit, OnChanges {

    public clients: any[] = [];
    public name = '';
    public activeWeek: { start: string, end: string } = {
        start: moment().startOf('w').format(environment.apiDateFormat),
        end: moment().endOf('w').format(environment.apiDateFormat)
    };

    public activeCalendar: {
        client: Client,
        calendar: { start: Date, appointments: SessionEvent[] }[],
        rawCalendar: SessionEvent[]
    } = {
        client: null,
        calendar: null,
        rawCalendar: null
    };
    public selection = false;

    constructor(private menu: MenuController,
                public clientsService: ClientsService,
                public calendarService: CalendarService,
                private loadingController: LoadingController,
                private modalController: ModalController,
                private router: Router,
                private toastController: ToastController,
                private alertController: AlertController,
                public translateService: TranslateService,
                private network: Network,
                public networkService: NetworkService
    ) {
    }

    ngOnInit() {
        this.networkService.checkNetwork(this.network, this.router);
    }

    ngOnChanges() {
        this.networkService.checkNetwork(this.network, this.router);
    }

    showMenu() {
        this.menu.open();
    }

    async nameChanged() {
        if (this.name && !this.selection) {
            this.clients = await this.clientsService.getClientsByName(this.name);
        } else {
            this.selection = false;
        }
    }

    showEventDetails(event: SessionEvent) {
        this.router.navigate(['/menu/calendar/' + event.id]);
    }

    public async toggleCommunicated(event: SessionEvent) {
        const confirm = await this.translateService
            .get('GENERAL.CONFIRM')
            .toPromise();
        const a = await this.alertController.create({
            message: await this.translateService
                .get('CALENDAR_ITEM.CONFIRM_COMMUNICATED_' + event.clientCommunicated.toString().toUpperCase())
                .toPromise(),
            header: confirm,
            buttons: [{
                text: confirm,
                handler: async () => {
                    try {
                        await this.calendarService.updateClientNotified([event.id], !event.clientCommunicated);
                        this.clientSelected(this.activeCalendar.client);
                    } catch (err) {
                        await this.handleError(err);
                    }
                }
            }, {
                text: await this.translateService
                    .get('GENERAL.CANCEL')
                    .toPromise(),
                handler: () => {
                    return;
                }
            }]
        });
        a.present();
    }

    async clientSelected(client: any, dates?: { start: string, end: string }) {
        try {
            this.activeWeek =
                dates &&
                moment(dates.start).format(environment.apiDateFormat) &&
                moment(dates.end).format(environment.apiDateFormat) ? dates : {
                    start: moment().startOf('w').format(environment.apiDateFormat),
                    end: moment().endOf('w').format(environment.apiDateFormat)
                };
            const loading = await this.loadingController.create({
                message: await this.translateService.get('GENERAL.LOADING').toPromise(),
                backdropDismiss: false
            });
            await loading.present();
            this.selection = true;
            this.name = client.name + ' ' + client.surname;
            this.clients = [];
            const calendar = [];
            const week = {};


            this.activeCalendar = {
                client: null,
                calendar: null,
                rawCalendar: null
            };

            const rawCalendar = (await this.clientsService.getClientCalendar(client.id, this.activeWeek));

            rawCalendar.forEach((item) => {
                if (!week['day' + moment(item.start).format('e-w')]) {
                    week['day' + moment(item.start).format('e-w')] = [];
                }
                week['day' + moment(item.start).format('e-w')].push(item);
            });

            for (const weekKey in week) {
                if (week[weekKey] && week[weekKey].length) {
                    calendar.push({
                        start: week[weekKey][0].start,
                        appointments: week[weekKey]
                    });
                }
            }

            loading.dismiss();
            this.activeCalendar = {
                client,
                calendar,
                rawCalendar
            };
        } catch (err) {
            console.log(err);
        }
    }

    isDeviceOnline() {
        return localStorage.getItem('device-offline') === 'false';
    }

    async communicateAll() {
        const modal = await this.modalController.create({
            component: CommunicateAllModalComponent,
            componentProps: {
                calendar: this.activeCalendar.rawCalendar
            }
        });

        modal.present();

        modal.onDidDismiss().then((d) => {
            if (d.data && d.data.length) {
                this.calendarService.updateClientNotified(d.data, true).then(async () => {
                    this.clientSelected(this.activeCalendar.client);
                }, (err) => {
                    console.log(err);
                    this.clientSelected(this.activeCalendar.client);
                });
            }
        });
    }

    async presentToast(message: string, color: Color = 'primary', dismissable: boolean = false) {
        const toast = await this.toastController.create({
            message,
            color,
            showCloseButton: dismissable,
            closeButtonText: await this.translateService.get('GENERAL.CLOSE').toPromise(),
            duration: dismissable ? undefined : 1500
        });
        toast.present();
    }

    weekChange() {
        this.clientSelected(this.activeCalendar.client, this.activeWeek);
    }

    private async handleError(err): Promise<void> {
        let message;
        console.error(err);
        if (err) {
            switch (err.statusText) {
                case 'Not Found':
                    message = await this.translateService.get('ERROR_MESSAGES.NOT_FOUND').toPromise();
                    break;
                case 'Unauthorised':
                    message = await this.translateService.get('ERROR_MESSAGES.UNAUTHORIZED').toPromise();
                    break;
                default:
                    message = await this.translateService.get('ERROR_MESSAGES.GENERIC').toPromise();
            }
        } else {
            message = await this.translateService.get('ERROR_MESSAGES.GENERIC').toPromise();
        }

        this.presentToast(message, 'danger', true);
    }

}
