import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-create-travel-time-modal',
    templateUrl: './create-travel-time-modal.component.html',
    styleUrls: ['./create-travel-time-modal.component.scss'],
})
export class CreateTravelTimeModalComponent implements OnInit {
    requestedStart: Date;
    requestedEnd: Date;
    @Input() day: Date;

    constructor(public modalController: ModalController,
                private translateService: TranslateService
    ) {
    }

    ngOnInit() {
    }

    durationChanged(ev: { start: Date, end: Date }) {
        this.requestedEnd = ev.end;
        this.requestedStart = ev.start;
    }

    async submit() {
        const message = await this.translateService.get('CONFIRMATION_MESSAGES.TRAVEL_TIME_SUCCESS').toPromise();
        const confirmationModal = await this.modalController.create({
            component: ConfirmationModalComponent,
            cssClass: 'confirmation-modal',
            componentProps: {message}
        });
        confirmationModal.present();
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
        await confirmationModal.dismiss();
        this.modalController.dismiss({start: this.requestedStart, end: this.requestedEnd});
    }

    dismiss() {
        this.modalController.dismiss();
    }

}
