import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EditCalendarItemPage} from './edit-calendar-item.page';
import {TranslateModule} from '@ngx-translate/core';
import {DurationInputModule} from '../components/duration-input/duration-input.module';
import {AgendaItemModule} from '../components/agenda-item/agenda-item.module';

const routes: Routes = [
    {
        path: '',
        component: EditCalendarItemPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule,
        DurationInputModule,
        AgendaItemModule
    ],
    declarations: [EditCalendarItemPage],
})
export class EditCalendarItemPageModule {
}
