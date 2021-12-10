import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommunicateAllModalComponent} from './communicate-all-modal.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [CommunicateAllModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule
    ],
    exports: [CommunicateAllModalComponent]
})
export class CommunicateAllModalModule {
}
