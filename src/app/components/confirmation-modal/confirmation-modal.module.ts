import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationModalComponent} from './confirmation-modal.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [ConfirmationModalComponent],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        ConfirmationModalComponent
    ]
})
export class ConfirmationModalModule {
}
