import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController, PickerController} from '@ionic/angular';
import {KilometersService} from '../../service/kilometers.service';

export interface DistancesSupplement {
    AUTO: number;
    BROMFIETS: number;
    CARPOOL: number;
    MOTO: number;
    FIETS: number;
}

@Component({
    selector: 'app-create-distance-modal',
    templateUrl: './create-distance-modal.component.html',
    styleUrls: ['./create-distance-modal.component.scss'],
})
export class CreateDistanceModalComponent implements OnInit {
    @Input() day: Date;
    @Input() values: DistancesSupplement = {
        AUTO: null,
        BROMFIETS: null,
        CARPOOL: null,
        MOTO: null,
        FIETS: null,
    };
    public type: string;
    public types: string[] = [];

    @ViewChild('distanceInput', {static: false}) input;

    constructor(
        private pickerCtrl: PickerController,
        private modalController: ModalController,
        private kilometersService: KilometersService
    ) {
    }

    ngOnInit() {
        this.types = this.kilometersService.getKilometerTypes();
    }

    public async submit(): Promise<void> {
        await this.modalController.dismiss({values: this.values, type: this.type});
    }

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async fieldFocus(): Promise<void> {
        const e = await this.input.getInputElement();
        e.select();
    }

}
