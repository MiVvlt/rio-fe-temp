import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateDistanceModalComponent} from './create-distance-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [CreateDistanceModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        FormsModule
    ],
    exports: [
        CreateDistanceModalComponent
    ]
})
export class CreateDistanceModalModule {
}
