import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CalendarItemComponent} from './calendar-item.component';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {StatusPopoverModule} from '../components/status-popover/status-popover.module';
import {AgendaItemModule} from '../components/agenda-item/agenda-item.module';

const routes: Routes = [
    {
        path: '',
        component: CalendarItemComponent
    }
];

@NgModule({
    declarations: [
        CalendarItemComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
        TranslateModule,
        StatusPopoverModule,
        AgendaItemModule
    ],
    exports: [
        CalendarItemComponent
    ],
    providers: [
        CallNumber
    ]
})
export class CalendarItemModule {
}
