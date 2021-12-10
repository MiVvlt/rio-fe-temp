import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgendaItemComponent} from './agenda-item.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {StatusPopoverModule} from '../status-popover/status-popover.module';


@NgModule({
    declarations: [AgendaItemComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        StatusPopoverModule
    ],
    exports: [AgendaItemComponent]
})
export class AgendaItemModule {
}
