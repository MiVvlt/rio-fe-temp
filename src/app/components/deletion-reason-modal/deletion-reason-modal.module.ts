import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeletionReasonModalComponent} from './deletion-reason-modal.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [DeletionReasonModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule
    ],
    exports: [DeletionReasonModalComponent]
})
export class DeletionReasonModalModule {
}
