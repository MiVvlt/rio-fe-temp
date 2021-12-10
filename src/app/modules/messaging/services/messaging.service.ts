import {Injectable, ChangeDetectorRef, EventEmitter} from '@angular/core';
import {FCM} from '@ionic-native/fcm/ngx';
import {DeviceService} from '../../../service/device.service';
import {Device} from '../../../interface/device';
import {Message} from '../models/Message';
import {MessageType} from '../models/MessageType';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../service/notification.service';
import {CalendarService} from '../../../service/calendar.service';


@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    public messageEmitter: EventEmitter<Message> = new EventEmitter();

    constructor(
        private alertController: AlertController,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private fcm: FCM,
        private deviceService: DeviceService,
        private calendarService: CalendarService,
        private router: Router) {
    }

    public initialize(): void {
        this.initPushNotification();
    }

    private initPushNotification() {
        this.fcm.getToken().then(token => {
            this.registerDevice(token);
        });

        this.fcm.onNotification().subscribe((data) => {
            if (data.wasTapped) {
                console.log('Received in background', data);
            } else {
                console.log('Received in foreground', data);
            }
            const message: any = new Message();
            message.type = MessageType[data.type];
            message.reference = data.reference;
            message.id = data.id;
            message.body = data.body;
            message.title = data.title;
            this.messageEmitter.emit(message);
            this.handleMessage(message as Message);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
            this.registerDevice(token);
        });
    }

    async registerDevice(token: string) {
        const device = new Device();
        device.token = token;
        await this.deviceService.registerDevice(device);
    }

    private handleMessage(message: Message) {
        switch (message.type) {
            case MessageType.PLANNINGPUSH:
                console.log('messageType ' + MessageType.PLANNINGPUSH);
                this.showChangeNotification(message);
                break;
            case MessageType.CHANGEPUSH:
                console.log('messageType ' + MessageType.CHANGEPUSH);
                this.showChangeNotification(message);
                break;
            case MessageType.LOCK:
                console.log('messageType ' + MessageType.LOCK);
                break;
            case MessageType.CHANGEREQUEST:
                console.log('navigating for messageType ' + MessageType.CHANGEREQUEST);
                this.showChangeNotification(message);
                break;
            case MessageType.SWITCHPUSH:
                console.log('messageType ' + MessageType.SWITCHPUSH);
                break;
            case MessageType.SWITCHREQUEST:
                console.log('messageType ' + MessageType.SWITCHREQUEST);
                break;
            case MessageType.VALIDATE:
                console.log('messageType ' + MessageType.VALIDATE);
                break;
            case MessageType.REFRESH:
                console.log('messageType ' + MessageType.REFRESH);
                break;
            default :
                console.log('No valid MessageType');
        }

    }

    async showChangeNotification(message: Message) {
        const alert = await this.alertController.create({
            header: await this.translateService.get('CHANGE_NOTIFICATION.LABEL').toPromise(),
            subHeader: message.title,
            message: message.body,
            buttons: [
                {
                    text: await this.translateService.get('CHANGE_NOTIFICATION.SHOW').toPromise(),
                    handler: () => {
                        this.notificationService.update(message.id);
                        this.router.navigate(['/menu/calendar/' + message.reference]);
                    }
                },
                {
                    text: await this.translateService.get('CHANGE_NOTIFICATION.DISMISS').toPromise(),
                    handler: () => {
                        if ('/menu/calendar' === this.router.url) {
                            this.router.navigateByUrl(this.router.url);
                        }
                    }
                }
            ]
        });

        await alert.present();
    }


}
