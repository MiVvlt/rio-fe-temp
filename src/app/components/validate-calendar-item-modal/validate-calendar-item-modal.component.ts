import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-validate-calendar-item-modal',
    templateUrl: './validate-calendar-item-modal.component.html',
    styleUrls: ['./validate-calendar-item-modal.component.scss'],
})
export class ValidateCalendarItemModalComponent implements OnInit {
    @Input() calendarEvent;
    public rosterDisturbance;
    public rosterDisturbanceOptions = ['A', 'B', 'C'];
    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    cancel() {
        this.modalController.dismiss(null);
    }

    submit() {
        this.modalController.dismiss({rosterDisturbance: this.rosterDisturbance});
    }

}
