import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-deletion-reason-modal',
    templateUrl: './deletion-reason-modal.component.html',
    styleUrls: ['./deletion-reason-modal.component.scss'],
})
export class DeletionReasonModalComponent implements OnInit {

    reason: string;
    customerRequested: string;
    message = '';

    constructor(public modalController: ModalController, public translateService: TranslateService) {
    }

    async ngOnInit() {
        this.message = await this.translateService.get('CONFIRMATION_MESSAGES.DELETE_CALENDAR_SESSION_REASON').toPromise();
    }

    submit() {
        this.modalController.dismiss(this.reason, this.customerRequested);
    }

    dismiss() {
        this.modalController.dismiss();
    }

}
