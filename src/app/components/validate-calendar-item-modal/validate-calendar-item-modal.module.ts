import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValidateCalendarItemModalComponent} from './validate-calendar-item-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AgendaItemModule} from '../agenda-item/agenda-item.module';


@NgModule({
    declarations: [ValidateCalendarItemModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule,
        AgendaItemModule,
    ],
    exports: [ValidateCalendarItemModalComponent]
})
export class ValidateCalendarItemModalModule {
}
