import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ConfirmationActionModalComponent} from './confirmation-action-modal.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [ConfirmationActionModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ],
    exports: [
        ConfirmationActionModalComponent
    ]
})
export class ConfirmationActionModalModule {
}
