import {Component, OnInit} from '@angular/core';
import {SessionEvent} from '../../interface/SessionEvent';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {CalendarService} from '../../service/calendar.service';
import {TranslateService} from '@ngx-translate/core';

export class ValidateAllSessionEvent extends SessionEvent {
    public toValidate = true;

    constructor() {
        super();
    }
}

@Component({
    selector: 'app-validate-all-modal',
    templateUrl: './validate-all-modal.component.html',
    styleUrls: ['./validate-all-modal.component.scss'],
})
export class ValidateAllModalComponent implements OnInit {
    unvalidatedItems: ValidateAllSessionEvent[] = [];
    loader;

    constructor(
        public modal: ModalController,
        public calendarService: CalendarService,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public translateService: TranslateService
    ) {
    }

    async ngOnInit() {
        await this.createLoader();
        this.loader.present();
        await this.getSessionEvents();
        this.loader.dismiss();
    }

    public async createLoader() {
        this.loader = await this.loadingController.create({
            message: await (this.translateService.get('GENERAL.LOADING').toPromise()),
            backdropDismiss: false
        });
    }

    public async getSessionEvents() {
        this.unvalidatedItems = await this.calendarService.getUnvalidatedCalendarEvents();
    }

    public async confirm() {

        const toValidate = this.unvalidatedItems.filter(this.toValidateFilter);
        const overlappingWithAbsence = toValidate.filter(this.overlapsWithAbsenceFilter);

        if (overlappingWithAbsence.length) {
            const alert = await this.alertController.create({
                header: await this.translateService.get('VALIDATE_ALL.OVERLAPPING_ABSENCE').toPromise(),
                subHeader: await this.translateService.get('VALIDATE_ALL.OVERLAPPING_ABSENCE_MESSAGE').toPromise(),
                message: this.createOverlappingMessage(overlappingWithAbsence),
                buttons: [{
                    text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => undefined
                }, {
                    text: await this.translateService.get('GENERAL.CONFIRM').toPromise(),
                    cssClass: 'primary',
                    handler: () => {
                        this.modal.dismiss(toValidate);
                    }
                }]
            });
            await alert.present();
        } else {
            await this.modal.dismiss(toValidate);
        }
    }

    public async cancel() {
        await this.modal.dismiss();
    }

    public toValidateFilter(i: ValidateAllSessionEvent) {
        return i.toValidate;
    }

    public overlapsWithAbsenceFilter(i: ValidateAllSessionEvent) {
        return i.overlappingAbsence;
    }

    public createOverlappingMessage(items: ValidateAllSessionEvent[]): string {
        let result = '';
        for (const i of items) {
            result += i.getLabel() + '<br>';
        }
        return result;
    }
}
