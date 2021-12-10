import {Component, OnInit} from '@angular/core';
import {LoadingController, MenuController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {CalendarService} from '../service/calendar.service';
import {SessionEvent} from '../interface/SessionEvent';
import {DomSanitizer} from '@angular/platform-browser';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {ChangeRequest} from '../interface/ChangeRequest';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-calendar-item',
    templateUrl: './calendar-item.component.html',
    styleUrls: ['./calendar-item.component.scss'],
})
export class CalendarItemComponent implements OnInit {
    public id: string;
    public calendarEvent: SessionEvent;

    public bubbleTitle: string;
    public changeRequested: boolean;
    public changeImposed: boolean;
    public imposedChange: ChangeRequest;

    constructor(private menu: MenuController,
                public sanitizer: DomSanitizer,
                private calendarService: CalendarService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private nav: NavController,
                public callNumber: CallNumber,
                private loadingController: LoadingController,
                private translateService: TranslateService
    ) {
    }

    async ngOnInit() {
        const idPromise = this.getId();

        const loading = await this.loadingController.create({
            message: await this.translateService.get('GENERAL.DATA_LOADING').toPromise(),
            backdropDismiss: false
        });
        await loading.present();
        this.id = await idPromise;
        if (isNullOrUndefined(this.id)) {
            await loading.dismiss();
            await this.router.navigate(['/menu/calendar']);
        }
        this.calendarEvent = await this.calendarService.getCalendarEventById(this.id);

        try {
            this.calendarEvent.pendingChange = await this.calendarService.getChangeRequest(this.id);
        } catch (err) {
            console.error(err);
        }
        this.setBubbleTitle();
        this.changeRequested = this.calendarEvent.requestPending();

        if (this.calendarEvent.status === 'CHANGED') {
            try {
                this.imposedChange = await this.calendarService.getImposedChangeRequest(this.id);
                this.changeImposed = this.imposedChange !== null && this.imposedChange !== undefined;
            } catch (err) {
                console.error(err);
                this.loadingController.getTop().then(v => v ? loading.dismiss() : null);
                await loading.dismiss();
            }
        }

        if (isNullOrUndefined(this.calendarEvent)) {
            await loading.dismiss();
            await this.router.navigate(['/menu/calendar']);
        }
        await loading.dismiss();
    }

    private setBubbleTitle() {
        switch (this.calendarEvent.type) {
            case 'HULPBEURT':
                this.bubbleTitle = this.calendarEvent.client.fullName;
                break;

            case 'NOAH':
                this.bubbleTitle = this.calendarEvent.type;
                break;
        }
    }

    public async call(number) {
        await this.callNumber.callNumber(number, true);
    }

    getId(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.activatedRoute.params.subscribe((val) => {
                if (!isNullOrUndefined(val.id)) {
                    resolve(val.id);
                } else {
                    reject(new Error('Id is undefined'));
                }
            });
        });
    }

    public async showSessionDetails() {
        await this.router.navigate(['/menu/session-details/' + this.id]);
    }
}
