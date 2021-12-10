import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HolidayItemComponent} from './holiday-item.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [HolidayItemComponent],
    exports: [HolidayItemComponent],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class HolidayItemModule {
}
