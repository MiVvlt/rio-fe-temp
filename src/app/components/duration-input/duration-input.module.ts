import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {DurationInputComponent} from './duration-input.component';


@NgModule({
    declarations: [DurationInputComponent],
    exports: [DurationInputComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ]
})
export class DurationInputModule {
}
