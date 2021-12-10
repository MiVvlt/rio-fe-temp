import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateTravelTimeModalComponent} from './create-travel-time-modal.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {ConfirmationModalComponent} from '../confirmation-modal/confirmation-modal.component';
import {ConfirmationModalModule} from '../confirmation-modal/confirmation-modal.module';
import {TranslateModule} from '@ngx-translate/core';
import {DurationInputModule} from '../duration-input/duration-input.module';


@NgModule({
    declarations: [CreateTravelTimeModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule,
        ConfirmationModalModule,
        DurationInputModule
    ],
    exports: [
        CreateTravelTimeModalComponent
    ],
    entryComponents: [
        ConfirmationModalComponent
    ]
})
export class CreateTravelTimeModalModule {
}
