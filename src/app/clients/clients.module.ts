import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ClientsPage} from './clients.page';
import {TranslateModule} from '@ngx-translate/core';
import {ClientsService} from '../service/clients.service';
import {CommunicateAllModalComponent} from '../components/communicate-all-modal/communicate-all-modal.component';
import {CommunicateAllModalModule} from '../components/communicate-all-modal/communicate-all-modal.module';
import {ClientAgendaItemModule} from '../components/client-agenda-item/client-agenda-item.module';
import {WeekSelectorModule} from '../components/week-selector/week-selector.module';
import {NetworkService} from '../service/network.service';

const routes: Routes = [
    {
        path: '',
        component: ClientsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule,
        CommunicateAllModalModule,
        ClientAgendaItemModule,
        WeekSelectorModule
    ],
    providers: [ClientsService, NetworkService],
    declarations: [ClientsPage],
    entryComponents: [CommunicateAllModalComponent]
})
export class ClientsPageModule {
}
