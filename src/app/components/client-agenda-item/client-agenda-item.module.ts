import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientAgendaItemComponent} from './client-agenda-item.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [ClientAgendaItemComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
    ],
    exports: [ClientAgendaItemComponent],
})
export class ClientAgendaItemModule {
}
