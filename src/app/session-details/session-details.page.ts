import {Component, Input, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {CalendarService} from '../service/calendar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-session-details',
    templateUrl: './session-details.page.html',
    styleUrls: ['./session-details.page.scss'],
})
export class SessionDetailsPage implements OnInit {
    calendarEvent;
    id;

    constructor(public calendarService: CalendarService,
                private activatedRoute: ActivatedRoute,
                private translateService: TranslateService,
                private loadingController: LoadingController,
                private router: Router
    ) {
    }

    async ngOnInit() {
        const loading = await this.loadingController.create({
            message: await this.translateService.get('GENERAL.DATA_LOADING').toPromise(),
            backdropDismiss: false
        });
        await loading.present();

        this.id = await this.getId();
        if (isNullOrUndefined(this.id)) {
            await loading.dismiss();
            await this.router.navigate(['/menu/calendar']);
        }
        this.calendarEvent = await this.calendarService.getCalendarEventById(this.id);
        if (isNullOrUndefined(this.calendarEvent)) {
            await loading.dismiss();
            await this.router.navigate(['/menu/calendar']);
        }
        loading.dismiss();
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

}
