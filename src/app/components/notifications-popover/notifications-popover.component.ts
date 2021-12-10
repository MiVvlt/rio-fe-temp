import {Component, Input, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';
import {PushNotification} from '../../interface/PushNotification';
import {NotificationService} from '../../service/notification.service';
import {PopoverController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SessionEvent} from '../../interface/SessionEvent';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
    selector: 'app-notifications-popover',
    templateUrl: './notifications-popover.component.html',
    styleUrls: ['./notifications-popover.component.scss'],
})
export class NotificationsPopoverComponent implements OnInit {

    public notifications: PushNotification [];
    public agendaItem: SessionEvent;
    public openItem: string;
    @Input()
    public notificationsAmount: number;

    constructor(
        public calendarService: CalendarService,
        public notificationService: NotificationService,
        public translateService: TranslateService,
        public popoverController: PopoverController,
        private router: Router) {
    }

    ngOnInit() {
        this.refreshNotifications();
    }

    public async refreshNotifications(event?) {

        try {
            this.notifications = await this.notificationService.getPushNotifications();
        } catch (err) {
            console.error(err);
        }

        this.notificationsAmount = isNotNullOrUndefined(this.notifications) ? this.notifications.length : 0;
        if (event) {
            event.target.complete();
        }
    }

    async show(item: PushNotification): Promise<void> {
        this.agendaItem = await this.calendarService.getCalendarEvent(item.reference);

        this.markRead(item);
        this.router.navigate(['/menu/calendar/' + item.reference]);
        this.popoverController.dismiss();
    }


    markRead(item: PushNotification) {
        this.notificationService.update(item.id).then(() => {
            this.refreshNotifications();
        });

    }

    async markAllAsRead(): Promise<void> {
        try {
            await this.notificationService.markAllAsRead();
            await this.refreshNotifications();
        } catch (err) {
            console.log(err);
        }
        return;
    }

    getTime(date: Date): string {
        return moment(date).fromNow();
    }
}
