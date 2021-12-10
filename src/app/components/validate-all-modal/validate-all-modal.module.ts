import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValidateAllModalComponent} from './validate-all-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [ValidateAllModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        FormsModule
    ],
    exports: [ValidateAllModalComponent]
})
export class ValidateAllModalModule {
}
