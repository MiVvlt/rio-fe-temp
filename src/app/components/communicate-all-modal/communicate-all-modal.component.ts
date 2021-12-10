import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SessionEvent, SessionEventCommunicated} from '../../interface/SessionEvent';

@Component({
    selector: 'app-communicate-all-modal',
    templateUrl: './communicate-all-modal.component.html',
    styleUrls: ['./communicate-all-modal.component.scss'],
})
export class CommunicateAllModalComponent implements OnInit {
    @Input() calendar: SessionEvent[];
    list: SessionEventCommunicated[];

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        this.list = SessionEventCommunicated.createFromSessionEventArray([...this.calendar]);
    }

    cancel() {
        this.modalController.dismiss();
    }

    confirm() {
        this.modalController.dismiss(
            this.list
                .filter((item) => {
                    return item.clientCommunicated;
                }).map((item) => {
                return item.id;
            }));
    }

}
