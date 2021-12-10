import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-confirmation-action-modal',
    templateUrl: './confirmation-action-modal.component.html',
    styleUrls: ['./confirmation-action-modal.component.scss'],
})
export class ConfirmationActionModalComponent implements OnInit {
    @Input() message: string;

    constructor(public modal: ModalController) {
    }

    ngOnInit() {
    }

    confirm() {
        this.modal.dismiss(true);
    }

    cancel() {
        this.modal.dismiss(false);
    }

}
